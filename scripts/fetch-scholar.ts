import * as fs from "fs";
import * as path from "path";
import {
  SCHOLAR_KEYWORD_GROUPS,
  SCHOLAR_MAX_RESULTS_PER_GROUP,
  SCHOLAR_MIN_YEAR,
  SCHOLAR_REQUEST_DELAY_MS,
} from "./config";
import type { ScholarItem, ArxivItem, SeenIdRegistry } from "./types";

const SEMANTIC_SCHOLAR_API =
  "https://api.semanticscholar.org/graph/v1/paper/search/bulk";
const API_KEY = process.env.SEMANTIC_SCHOLAR_API_KEY ?? "";

const FIELDS = [
  "paperId",
  "title",
  "abstract",
  "authors",
  "citationCount",
  "publicationVenue",
  "year",
  "fieldsOfStudy",
  "externalIds",
].join(",");

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MAX_RETRIES = 4;
const INITIAL_BACKOFF_MS = 10_000;
const RETRYABLE_STATUSES = [429, 500, 502, 503];

async function fetchWithRetry(
  url: string,
  retries = MAX_RETRIES,
): Promise<unknown | null> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (API_KEY) headers["x-api-key"] = API_KEY;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers });
      if (res.ok) return await res.json();

      console.warn(
        `  Attempt ${attempt}/${retries}: HTTP ${res.status} ${res.statusText}`,
      );
      if (RETRYABLE_STATUSES.includes(res.status)) {
        const retryAfter = res.headers.get("retry-after");
        const backoff = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        console.warn(`  Retrying in ${backoff / 1000}s...`);
        await sleep(backoff);
        continue;
      }
      return null;
    } catch (err) {
      console.warn(`  Attempt ${attempt}/${retries}: Network error - ${err}`);
      if (attempt < retries) {
        const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        console.warn(`  Retrying in ${backoff / 1000}s...`);
        await sleep(backoff);
      }
    }
  }
  return null;
}

function matchGroup(title: string, abstract: string): string {
  const text = `${title} ${abstract}`.toLowerCase();
  for (const [group, kws] of Object.entries(SCHOLAR_KEYWORD_GROUPS)) {
    if (kws.some((kw) => text.includes(kw.toLowerCase()))) return group;
  }
  return "other";
}

interface S2Paper {
  paperId: string;
  title?: string;
  abstract?: string;
  authors?: { name: string }[];
  citationCount?: number;
  publicationVenue?: { name?: string } | null;
  year?: number;
  fieldsOfStudy?: string[];
  externalIds?: Record<string, string>;
}

interface S2SearchResponse {
  total: number;
  token?: string;
  data?: S2Paper[];
}

function loadArxivIds(): Set<string> {
  const axPath = path.join(process.cwd(), "data", "_arxiv.json");
  try {
    const items: ArxivItem[] = JSON.parse(fs.readFileSync(axPath, "utf-8"));
    return new Set(items.map((i) => i.arxivId));
  } catch {
    return new Set();
  }
}

function loadSeenIds(): Set<string> {
  const seenPath = path.join(process.cwd(), "data", "seen-ids.json");
  try {
    const registry: SeenIdRegistry = JSON.parse(fs.readFileSync(seenPath, "utf-8"));
    const today = new Date().toISOString().slice(0, 10);
    // Only treat as "seen" if it appeared on a *different* day
    return new Set(
      Object.entries(registry.ids)
        .filter(([, dates]) => dates.some((d) => d !== today))
        .map(([id]) => id),
    );
  } catch {
    return new Set();
  }
}

function toScholarItem(paper: S2Paper, group: string): ScholarItem | null {
  if (!paper.paperId || !paper.title) return null;

  const authors = (paper.authors ?? []).map((a) => a.name);
  const venue =
    typeof paper.publicationVenue === "object"
      ? paper.publicationVenue?.name ?? ""
      : "";
  const pubDate = paper.year ? `${paper.year}-01-01` : new Date().toISOString().slice(0, 10);

  return {
    id: `scholar-${paper.paperId}`,
    source: "scholar",
    title: paper.title,
    description: (paper.abstract ?? "").replace(/\s+/g, " ").trim(),
    url: `https://www.semanticscholar.org/paper/${paper.paperId}`,
    date: pubDate,
    authors,
    tags: paper.fieldsOfStudy ?? [],
    matchedGroup: group,
    paperId: paper.paperId,
    citationCount: paper.citationCount ?? 0,
    publicationVenue: venue,
    publicationYear: paper.year ?? new Date().getFullYear(),
    fieldsOfStudy: paper.fieldsOfStudy ?? [],
    externalIds: paper.externalIds
      ? { DOI: paper.externalIds.DOI, ArXiv: paper.externalIds.ArXiv }
      : undefined,
  };
}
async function fetchAll(): Promise<ScholarItem[]> {
  const groups = Object.entries(SCHOLAR_KEYWORD_GROUPS);
  const seen = new Set<string>();
  const arxivIds = loadArxivIds();
  const seenIds = loadSeenIds();
  const allItems: ScholarItem[] = [];

  for (const [group, keywords] of groups) {
    const query = keywords.join(" | ");
    const params = new URLSearchParams({
      query,
      fields: FIELDS,
      sort: "publicationDate:desc",
      year: `${SCHOLAR_MIN_YEAR}-`,
      fieldsOfStudy: "Computer Science,Engineering",
    });
    const url = `${SEMANTIC_SCHOLAR_API}?${params}`;

    console.log(
      `Fetching [${group}] (${keywords.length} keywords, max ${SCHOLAR_MAX_RESULTS_PER_GROUP})...`,
    );
    const json = (await fetchWithRetry(url)) as S2SearchResponse | null;
    if (!json?.data) {
      console.warn(`  Skipping [${group}] after failed retries`);
      await sleep(SCHOLAR_REQUEST_DELAY_MS);
      continue;
    }

    let added = 0;
    let skippedDedup = 0;
    for (const paper of json.data) {
      if (added >= SCHOLAR_MAX_RESULTS_PER_GROUP) break;
      if (seen.has(paper.paperId)) continue;
      if (paper.externalIds?.ArXiv && arxivIds.has(paper.externalIds.ArXiv)) {
        skippedDedup++;
        continue;
      }
      if (seenIds.has(`scholar-${paper.paperId}`)) {
        skippedDedup++;
        continue;
      }

      const item = toScholarItem(paper, group);
      if (item) {
        seen.add(paper.paperId);
        allItems.push(item);
        added++;
      }
    }
    console.log(
      `  Got ${json.data.length} results, ${added} new, ${skippedDedup} deduped (${allItems.length} total)`,
    );
    await sleep(SCHOLAR_REQUEST_DELAY_MS);
  }

  // Sort by citation count so high-impact papers surface first in the feed
  allItems.sort((a, b) => b.citationCount - a.citationCount);
  console.log(
    `Fetched ${allItems.length} unique papers across ${groups.length} groups`,
  );
  return allItems;
}

async function main() {
  const items = await fetchAll();

  const outDir = path.join(process.cwd(), "data");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "_scholar.json");
  fs.writeFileSync(outPath, JSON.stringify(items, null, 2));
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import * as fs from "fs";
import * as path from "path";
import { XMLParser } from "fast-xml-parser";
import {
  ARXIV_CATEGORIES,
  ARXIV_KEYWORD_GROUPS,
  ARXIV_MAX_RESULTS,
  REQUEST_DELAY_MS,
} from "./config";
import type { ArxivItem } from "./types";

const ARXIV_API = "https://export.arxiv.org/api/query";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

function extractId(idUrl: string): string {
  const m = idUrl.match(/(\d+\.\d+)/);
  return m ? m[1] : idUrl;
}

function toArray<T>(val: T | T[] | undefined): T[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}


function matchGroup(title: string, summary: string): string {
  const text = `${title} ${summary}`.toLowerCase();
  for (const [group, kws] of Object.entries(ARXIV_KEYWORD_GROUPS)) {
    if (kws.some((kw) => text.includes(kw.toLowerCase()))) return group;
  }
  return "other";
}

const MAX_RETRIES = 4;
const INITIAL_BACKOFF_MS = 10000;
const RETRYABLE_STATUSES = [429, 500, 502, 503];

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<string | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.text();

      console.warn(`  Attempt ${attempt}/${retries}: HTTP ${res.status} ${res.statusText}`);
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

function buildGroupQuery(group: string, keywords: string[]): string {
  const catPart = ARXIV_CATEGORIES.map((c) => `cat:${c}`).join("+OR+");
  const kwPart = keywords
    .map((kw) => `all:%22${kw.replace(/\s+/g, "+")}%22`)
    .join("+OR+");
  return `%28${catPart}%29+AND+%28${kwPart}%29`;
}

function parseEntries(xml: string): ArxivItem[] {
  const parsed = parser.parse(xml);
  const entries = toArray(parsed?.feed?.entry);
  const items: ArxivItem[] = [];

  for (const entry of entries) {
    if (!entry.id) continue;
    const arxivId = extractId(entry.id);
    const authors = toArray(entry.author).map(
      (a: { name: string }) => a.name,
    );
    const links = toArray(entry.link);
    const pdfLink = links.find(
      (l: { "@_type"?: string }) => l["@_type"] === "application/pdf",
    );
    const cats = toArray(entry.category).map(
      (c: { "@_term": string }) => c["@_term"],
    );
    const title = String(entry.title).replace(/\s+/g, " ").trim();
    const description = String(entry.summary).replace(/\s+/g, " ").trim();
    const published = new Date(entry.published);

    items.push({
      id: `arxiv-${arxivId}`,
      source: "arxiv",
      title,
      description,
      url: `https://arxiv.org/abs/${arxivId}`,
      date: published.toISOString().slice(0, 10),
      authors,
      tags: cats,
      matchedGroup: matchGroup(title, description),
      arxivId,
      pdfUrl: pdfLink?.["@_href"] ?? `https://arxiv.org/pdf/${arxivId}`,
      primaryCategory: cats[0] ?? "",
    });
  }
  return items;
}

async function fetchAll(): Promise<ArxivItem[]> {
  const groups = Object.entries(ARXIV_KEYWORD_GROUPS);
  const perGroup = Math.max(10, Math.floor(ARXIV_MAX_RESULTS / groups.length));
  const seen = new Set<string>();
  const allItems: ArxivItem[] = [];

  for (const [group, keywords] of groups) {
    const query = buildGroupQuery(group, keywords);
    const url =
      `${ARXIV_API}?search_query=${query}` +
      `&sortBy=submittedDate&sortOrder=descending` +
      `&max_results=${perGroup}`;

    console.log(`Fetching [${group}] (${keywords.length} keywords, max ${perGroup})...`);
    const xml = await fetchWithRetry(url);
    if (!xml) {
      console.warn(`  Skipping [${group}] after failed retries`);
      await sleep(REQUEST_DELAY_MS);
      continue;
    }

    const items = parseEntries(xml);
    let added = 0;
    for (const item of items) {
      if (!seen.has(item.arxivId)) {
        seen.add(item.arxivId);
        allItems.push(item);
        added++;
      }
    }
    console.log(`  Got ${items.length} results, ${added} new (${allItems.length} total)`);
    await sleep(REQUEST_DELAY_MS);
  }

  console.log(`Fetched ${allItems.length} unique papers across ${groups.length} groups`);
  return allItems;
}

async function main() {
  const items = await fetchAll();

  const outDir = path.join(process.cwd(), "data");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "_arxiv.json");
  fs.writeFileSync(outPath, JSON.stringify(items, null, 2));
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

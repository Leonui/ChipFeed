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

function buildQuery(): string {
  const catPart = ARXIV_CATEGORIES.map((c) => `cat:${c}`).join("+OR+");
  const allKeywords: string[] = [];
  for (const kws of Object.values(ARXIV_KEYWORD_GROUPS)) {
    allKeywords.push(...kws);
  }
  const kwPart = allKeywords
    .map((kw) => `all:%22${kw.replace(/\s+/g, "+")}%22`)
    .join("+OR+");
  return `%28${catPart}%29+AND+%28${kwPart}%29`;
}

function matchGroup(title: string, summary: string): string {
  const text = `${title} ${summary}`.toLowerCase();
  for (const [group, kws] of Object.entries(ARXIV_KEYWORD_GROUPS)) {
    if (kws.some((kw) => text.includes(kw.toLowerCase()))) return group;
  }
  return "other";
}

async function fetchAll(): Promise<ArxivItem[]> {
  const query = buildQuery();
  const url =
    `${ARXIV_API}?search_query=${query}` +
    `&sortBy=submittedDate&sortOrder=descending` +
    `&max_results=${ARXIV_MAX_RESULTS}`;

  console.log("Fetching arXiv papers (single request)...");
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`HTTP ${res.status}: ${res.statusText}`);
    return [];
  }

  const xml = await res.text();
  const parsed = parser.parse(xml);
  const entries = toArray(parsed?.feed?.entry);
  const items: ArxivItem[] = [];

  for (const entry of entries) {
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

  console.log(`Fetched ${items.length} papers`);
  return items;
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

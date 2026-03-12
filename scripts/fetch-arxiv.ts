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
import { sleep, fetchWithRetry, matchGroup } from "./utils";

const ARXIV_API = "https://export.arxiv.org/api/query";

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


function matchArxivGroup(title: string, summary: string): string {
  return matchGroup(`${title} ${summary}`, ARXIV_KEYWORD_GROUPS);
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
      matchedGroup: matchArxivGroup(title, description),
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
    const res = await fetchWithRetry(url);
    if (!res) {
      console.warn(`  Skipping [${group}] after failed retries`);
      await sleep(REQUEST_DELAY_MS);
      continue;
    }
    const xml = await res.text();

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

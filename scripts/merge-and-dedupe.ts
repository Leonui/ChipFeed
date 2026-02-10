import * as fs from "fs";
import * as path from "path";
import type { GitHubItem, ArxivItem, DailyData, IndexManifest } from "./types";

const dataDir = path.join(process.cwd(), "data");
const dailyDir = path.join(dataDir, "daily");

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function readJson<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function main() {
  fs.mkdirSync(dailyDir, { recursive: true });

  const ghPath = path.join(dataDir, "_github.json");
  const axPath = path.join(dataDir, "_arxiv.json");

  const github = readJson<GitHubItem[]>(ghPath) ?? [];
  const arxiv = readJson<ArxivItem[]>(axPath) ?? [];

  github.sort((a, b) => b.stars - a.stars);
  arxiv.sort((a, b) => b.date.localeCompare(a.date));

  const dateStr = today();
  const daily: DailyData = {
    date: dateStr,
    fetchedAt: new Date().toISOString(),
    github,
    arxiv,
  };

  const dailyPath = path.join(dailyDir, `${dateStr}.json`);
  fs.writeFileSync(dailyPath, JSON.stringify(daily, null, 2));
  console.log(`Wrote ${dailyPath}`);
  console.log(`  GitHub: ${github.length}, arXiv: ${arxiv.length}`);

  // Update index
  const indexPath = path.join(dataDir, "index.json");
  let index = readJson<IndexManifest>(indexPath) ?? {
    dates: [],
    lastUpdated: "",
  };

  if (!index.dates.includes(dateStr)) {
    index.dates.push(dateStr);
    index.dates.sort().reverse();
  }
  index.lastUpdated = new Date().toISOString();

  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`Updated index.json (${index.dates.length} dates)`);

  // Clean up temp files
  for (const f of [ghPath, axPath]) {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }
}

main();

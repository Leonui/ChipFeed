import * as fs from "fs";
import * as path from "path";
import { DATA_RETENTION_DAYS } from "./config";
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

function pruneOldFiles(index: IndexManifest): IndexManifest {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DATA_RETENTION_DAYS);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const kept: string[] = [];
  for (const date of index.dates) {
    if (date < cutoffStr) {
      const fp = path.join(dailyDir, `${date}.json`);
      if (fs.existsSync(fp)) {
        fs.unlinkSync(fp);
        console.log(`Pruned ${date}.json`);
      }
    } else {
      kept.push(date);
    }
  }
  index.dates = kept;
  return index;
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

  index = pruneOldFiles(index);
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`Updated index.json (${index.dates.length} dates)`);

  // Clean up temp files
  for (const f of [ghPath, axPath]) {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }
}

main();

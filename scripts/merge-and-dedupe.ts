import * as fs from "fs";
import * as path from "path";
import type { GitHubItem, ArxivItem, ScholarItem, DailyData, IndexManifest, SeenIdRegistry } from "./types";

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
  const scPath = path.join(dataDir, "_scholar.json");

  const github = readJson<GitHubItem[]>(ghPath) ?? [];
  const arxiv = readJson<ArxivItem[]>(axPath) ?? [];
  const scholar = readJson<ScholarItem[]>(scPath) ?? [];

  // Cross-day deduplication
  const seenPath = path.join(dataDir, "seen-ids.json");
  const seen: SeenIdRegistry = readJson<SeenIdRegistry>(seenPath) ?? {
    ids: {},
    lastUpdated: "",
  };

  const dateStr = today();

  const ghBefore = github.length;
  const filteredGh = github.filter((item) => {
    const dates = seen.ids[item.id];
    return !dates || dates.every((d) => d === dateStr);
  });
  const axBefore = arxiv.length;
  const filteredAx = arxiv.filter((item) => {
    const dates = seen.ids[item.id];
    return !dates || dates.every((d) => d === dateStr);
  });
  const scBefore = scholar.length;
  const filteredSc = scholar.filter((item) => {
    const dates = seen.ids[item.id];
    return !dates || dates.every((d) => d === dateStr);
  });

  console.log(
    `Filtered ${filteredGh.length}/${ghBefore} GitHub items (${ghBefore - filteredGh.length} duplicates), ` +
    `${filteredAx.length}/${axBefore} arXiv items (${axBefore - filteredAx.length} duplicates), ` +
    `${filteredSc.length}/${scBefore} Scholar items (${scBefore - filteredSc.length} duplicates)`
  );

  // Register new IDs
  for (const item of [...filteredGh, ...filteredAx, ...filteredSc]) {
    if (!seen.ids[item.id]) {
      seen.ids[item.id] = [dateStr];
    } else if (!seen.ids[item.id].includes(dateStr)) {
      seen.ids[item.id].push(dateStr);
    }
  }
  seen.lastUpdated = new Date().toISOString();
  seen.ids = Object.fromEntries(Object.entries(seen.ids).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(seenPath, JSON.stringify(seen, null, 2));

  filteredGh.sort((a, b) => b.stars - a.stars);
  filteredAx.sort((a, b) => b.date.localeCompare(a.date));
  filteredSc.sort((a, b) => b.citationCount - a.citationCount);

  const daily: DailyData = {
    date: dateStr,
    fetchedAt: new Date().toISOString(),
    github: filteredGh,
    arxiv: filteredAx,
    scholar: filteredSc,
  };

  const dailyPath = path.join(dailyDir, `${dateStr}.json`);
  fs.writeFileSync(dailyPath, JSON.stringify(daily, null, 2));
  console.log(`Wrote ${dailyPath}`);
  console.log(`  GitHub: ${filteredGh.length}, arXiv: ${filteredAx.length}, Scholar: ${filteredSc.length}`);

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
  for (const f of [ghPath, axPath, scPath]) {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }
}

main();

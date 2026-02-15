import * as fs from "fs";
import * as path from "path";
import type { DailyData, SeenIdRegistry } from "./types";

const dataDir = path.join(process.cwd(), "data");
const dailyDir = path.join(dataDir, "daily");

function main() {
  const files = fs.readdirSync(dailyDir).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));
  files.sort();

  const seen: SeenIdRegistry = { ids: {}, lastUpdated: "" };

  for (const file of files) {
    const daily: DailyData = JSON.parse(fs.readFileSync(path.join(dailyDir, file), "utf-8"));
    const date = daily.date;

    for (const item of [...daily.github, ...daily.arxiv]) {
      if (!seen.ids[item.id]) {
        seen.ids[item.id] = [date];
      } else if (!seen.ids[item.id].includes(date)) {
        seen.ids[item.id].push(date);
      }
    }
  }

  seen.lastUpdated = new Date().toISOString();
  seen.ids = Object.fromEntries(Object.entries(seen.ids).sort(([a], [b]) => a.localeCompare(b)));
  const outPath = path.join(dataDir, "seen-ids.json");
  fs.writeFileSync(outPath, JSON.stringify(seen, null, 2));

  const uniqueIds = Object.keys(seen.ids).length;
  console.log(`Backfilled ${uniqueIds} unique IDs from ${files.length} daily files`);
  console.log(`Written to ${outPath}`);
}

main();

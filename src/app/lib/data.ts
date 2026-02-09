import * as fs from "fs";
import * as path from "path";
import type { DailyData, IndexManifest } from "./types";

const dataDir = path.join(process.cwd(), "data");

export function getIndex(): IndexManifest {
  const fp = path.join(dataDir, "index.json");
  return JSON.parse(fs.readFileSync(fp, "utf-8"));
}

export function getDailyData(date: string): DailyData | null {
  const fp = path.join(dataDir, "daily", `${date}.json`);
  try {
    return JSON.parse(fs.readFileSync(fp, "utf-8"));
  } catch {
    return null;
  }
}

export function getLatestDate(): string | null {
  const index = getIndex();
  return index.dates[0] ?? null;
}

import * as fs from "fs";
import * as path from "path";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET } from "./r2-client";
import type { IndexManifest } from "./types";

const dataDir = path.join(process.cwd(), "data");
const dailyDir = path.join(dataDir, "daily");

async function downloadObject(key: string): Promise<string> {
  const res = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: key })
  );
  return (await res.Body?.transformToString("utf-8")) ?? "";
}

async function main(): Promise<void> {
  fs.mkdirSync(dailyDir, { recursive: true });

  // Download index.json
  console.log("Downloading index.json from R2...");
  let indexRaw: string;
  try {
    indexRaw = await downloadObject("index.json");
  } catch (err) {
    console.error("Failed to download index.json from R2:", err);
    console.error("Build cannot proceed without data.");
    process.exit(1);
  }

  const indexPath = path.join(dataDir, "index.json");
  fs.writeFileSync(indexPath, indexRaw);

  const index: IndexManifest = JSON.parse(indexRaw);
  console.log(`Index contains ${index.dates.length} date(s)`);

  // Download each daily file
  for (const date of index.dates) {
    const key = `daily/${date}.json`;
    console.log(`Downloading ${key}...`);
    const body = await downloadObject(key);
    fs.writeFileSync(path.join(dailyDir, `${date}.json`), body);
  }

  console.log("R2 download complete");
}

main().catch((err) => {
  console.error("R2 download failed:", err);
  process.exit(1);
});

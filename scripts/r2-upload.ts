import * as fs from "fs";
import * as path from "path";
import {
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { s3, BUCKET } from "./r2-client";
import { DATA_RETENTION_DAYS } from "./config";

const dataDir = path.join(process.cwd(), "data");
const dailyDir = path.join(dataDir, "daily");

async function uploadFile(key: string, filePath: string): Promise<void> {
  const body = fs.readFileSync(filePath, "utf-8");
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: "application/json",
    })
  );
  console.log(`Uploaded ${key}`);
}

async function pruneOldObjects(): Promise<string> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DATA_RETENTION_DAYS);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const listed = await s3.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: "daily/" })
  );

  const toDelete = (listed.Contents ?? []).filter((obj) => {
    const date = obj.Key?.replace("daily/", "").replace(".json", "");
    return date && date < cutoffStr;
  });

  if (toDelete.length === 0) {
    console.log("No old objects to prune");
    return cutoffStr;
  }

  await s3.send(
    new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: {
        Objects: toDelete.map((obj) => ({ Key: obj.Key! })),
      },
    })
  );
  console.log(`Pruned ${toDelete.length} old object(s) from R2`);
  return cutoffStr;
}

async function main(): Promise<void> {
  // Upload index.json
  const indexPath = path.join(dataDir, "index.json");
  if (!fs.existsSync(indexPath)) {
    throw new Error("data/index.json not found — run merge-and-dedupe first");
  }
  await uploadFile("index.json", indexPath);

  // Upload all daily/*.json files
  const dailyFiles = fs.readdirSync(dailyDir).filter((f) => f.endsWith(".json"));
  for (const file of dailyFiles) {
    await uploadFile(`daily/${file}`, path.join(dailyDir, file));
  }

  // Prune old objects beyond retention window
  const cutoffStr = await pruneOldObjects();

  // Remove pruned dates from index.json and re-upload
  const indexData = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
  const before = indexData.dates.length;
  indexData.dates = indexData.dates.filter((d: string) => d >= cutoffStr);
  if (indexData.dates.length < before) {
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
    await uploadFile("index.json", indexPath);
    console.log(`Removed ${before - indexData.dates.length} pruned date(s) from index.json`);
  }

  console.log("R2 upload complete");
}

main().catch((err) => {
  console.error("R2 upload failed:", err);
  process.exit(1);
});

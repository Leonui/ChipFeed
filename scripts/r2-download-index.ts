import * as fs from "fs";
import * as path from "path";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3, BUCKET } from "./r2-client";

const dataDir = path.join(process.cwd(), "data");

async function main(): Promise<void> {
  fs.mkdirSync(dataDir, { recursive: true });

  console.log("Downloading existing index.json from R2...");
  const res = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: "index.json" })
  );
  const body = (await res.Body?.transformToString("utf-8")) ?? "";
  fs.writeFileSync(path.join(dataDir, "index.json"), body);

  const { dates } = JSON.parse(body);
  console.log(`Downloaded index.json (${dates.length} dates)`);
}

main().catch((err) => {
  console.error("Failed to download index.json from R2:", err);
  process.exit(1);
});

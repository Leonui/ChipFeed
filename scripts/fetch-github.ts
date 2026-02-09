import * as fs from "fs";
import * as path from "path";
import {
  GITHUB_KEYWORD_GROUPS,
  REQUEST_DELAY_MS,
  GITHUB_MAX_PAGES,
  GITHUB_PER_PAGE,
} from "./config";
import type { GitHubItem } from "./types";

const GITHUB_API = "https://api.github.com/search/repositories";
const TOKEN = process.env.GH_PAT ?? "";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

async function fetchGroup(
  groupName: string,
  keywords: string[],
): Promise<GitHubItem[]> {
  const query = keywords.join(" OR ") + ` pushed:>${yesterday()}`;
  const items: GitHubItem[] = [];

  for (let page = 1; page <= GITHUB_MAX_PAGES; page++) {
    const params = new URLSearchParams({
      q: query,
      sort: "stars",
      order: "desc",
      per_page: String(GITHUB_PER_PAGE),
      page: String(page),
    });

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "rundown-site",
    };
    if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

    console.log(`  [${groupName}] page ${page}...`);
    const res = await fetch(`${GITHUB_API}?${params}`, { headers });

    if (!res.ok) {
      console.error(`  [${groupName}] HTTP ${res.status}: ${res.statusText}`);
      break;
    }

    const data = await res.json();
    const repos = data.items ?? [];
    if (repos.length === 0) break;

    for (const repo of repos) {
      items.push({
        id: `gh-${repo.full_name.replace("/", "-")}`,
        source: "github",
        title: repo.name,
        description: repo.description ?? "",
        url: repo.html_url,
        date: repo.pushed_at?.slice(0, 10) ?? "",
        authors: [repo.owner?.login ?? ""],
        tags: repo.topics ?? [],
        matchedGroup: groupName,
        stars: repo.stargazers_count ?? 0,
        language: repo.language ?? "",
        forks: repo.forks_count ?? 0,
        fullName: repo.full_name,
      });
    }

    if (repos.length < GITHUB_PER_PAGE) break;
    await sleep(REQUEST_DELAY_MS);
  }

  return items;
}

async function main() {
  console.log("Fetching GitHub repos...");
  const allItems: GitHubItem[] = [];
  const seen = new Set<string>();

  for (const [group, keywords] of Object.entries(GITHUB_KEYWORD_GROUPS)) {
    const items = await fetchGroup(group, keywords);
    for (const item of items) {
      if (!seen.has(item.fullName)) {
        seen.add(item.fullName);
        allItems.push(item);
      }
    }
    await sleep(REQUEST_DELAY_MS);
  }

  console.log(`Fetched ${allItems.length} unique GitHub repos.`);

  const outDir = path.join(process.cwd(), "data");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "_github.json");
  fs.writeFileSync(outPath, JSON.stringify(allItems, null, 2));
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

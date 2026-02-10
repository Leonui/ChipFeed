# ChipFeed

Daily news aggregator for hardware design, AI accelerators, and related topics. Fetches trending GitHub repos and new arXiv papers automatically via GitHub Actions, served as a static Next.js site on Vercel.

## Stack

- **Frontend:** Next.js 15 (App Router, static export) + Tailwind CSS v4
- **Data pipeline:** TypeScript scripts run by GitHub Actions (daily cron)
- **Storage:** Cloudflare R2 (S3-compatible object storage)
- **APIs:** GitHub Search API, arXiv API
- **Hosting:** Vercel (free tier)

> See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full pipeline diagram, environment setup, and content configuration.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Fetching Data Locally

```bash
export GH_PAT=your_github_personal_access_token
npm run fetch:github
npm run fetch:arxiv
npm run fetch:merge
```

Or all at once:

```bash
npm run fetch:all
```

## GitHub Actions

The workflow runs daily at 05:00 UTC and can also be triggered manually via `workflow_dispatch`.

**Required secrets** (Settings → Secrets):

| Secret | Purpose |
|--------|---------|
| `GH_PAT` | GitHub Personal Access Token for Search API |
| `R2_ENDPOINT` | Cloudflare R2 S3-compatible endpoint |
| `R2_ACCESS_KEY_ID` | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret |
| `R2_BUCKET_NAME` | R2 bucket name |
| `VERCEL_DEPLOY_HOOK` | Vercel deploy hook URL |

## Project Structure

```
├── .github/workflows/fetch-daily.yml   # Daily cron + manual trigger
├── docs/
│   └── ARCHITECTURE.md                 # Pipeline diagram, env vars, config
├── scripts/                            # Data pipeline scripts
│   ├── config.ts                       # Keywords, categories, constants
│   ├── types.ts                        # Shared RundownItem schema
│   ├── fetch-github.ts                 # GitHub Search API fetcher
│   ├── fetch-arxiv.ts                  # arXiv API fetcher
│   ├── merge-and-dedupe.ts             # Combine, dedupe, write daily JSON
│   ├── r2-client.ts                    # Shared S3 client for Cloudflare R2
│   ├── r2-upload.ts                    # Upload data to R2 + prune old objects
│   ├── r2-download.ts                  # Download data from R2 (Vercel prebuild)
│   └── r2-download-index.ts            # Download existing index.json before merge
├── data/                               # Downloaded at build time from R2 (git-ignored)
│   ├── index.json                      # Manifest of available dates
│   └── daily/                          # One JSON file per day
├── src/app/                            # Next.js App Router
│   ├── layout.tsx                      # Root layout + nav
│   ├── page.tsx                        # Home: latest day's feed
│   ├── day/[date]/page.tsx             # Single day view
│   ├── archive/page.tsx                # Past days list
│   ├── about/page.tsx                  # About page
│   ├── components/                     # UI components
│   └── lib/                            # Data loading utilities
└── package.json
```

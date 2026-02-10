# ChipFeed

Daily news aggregator for hardware design, AI accelerators, and related topics. Fetches trending GitHub repos and new arXiv papers automatically via GitHub Actions, served as a static Next.js site on Vercel.

## Stack

- **Frontend:** Next.js 15 (App Router, static export) + Tailwind CSS v4
- **Data pipeline:** TypeScript scripts run by GitHub Actions (daily cron)
- **APIs:** GitHub Search API, arXiv API
- **Hosting:** Vercel (free tier)

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

**Required secret:** Add `GH_PAT` (a GitHub Personal Access Token) to your repo's Settings > Secrets.

## Project Structure

```
├── .github/workflows/fetch-daily.yml   # Daily cron + manual trigger
├── scripts/                            # Data fetcher scripts
│   ├── config.ts                       # Keywords, categories, constants
│   ├── types.ts                        # Shared RundownItem schema
│   ├── fetch-github.ts                 # GitHub Search API fetcher
│   ├── fetch-arxiv.ts                  # arXiv API fetcher
│   └── merge-and-dedupe.ts             # Combine, dedupe, write daily JSON
├── data/                               # Committed JSON data
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

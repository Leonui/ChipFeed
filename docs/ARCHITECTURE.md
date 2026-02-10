# ChipFeed Architecture

> Full pipeline overview, environment setup, and content configuration.

## Workflow Diagram

```mermaid
flowchart TD
    subgraph "GitHub Actions (daily cron)"
        A[GitHub Search API] -->|fetch:github| C[data/_github.json]
        B[arXiv API] -->|fetch:arxiv| D[data/_arxiv.json]
        C --> E[merge-and-dedupe]
        D --> E
        E --> F[data/daily/YYYY-MM-DD.json\ndata/index.json]
        F --> G[r2-upload]
        G -->|PutObject + prune| H[(Cloudflare R2)]
        G --> I[curl Vercel deploy hook]
    end

    subgraph "Vercel Build"
        I -->|triggers| J[prebuild: r2-download]
        H -->|GetObject| J
        J --> K[data/daily/*.json\ndata/index.json]
        K --> L[next build — static export]
        L --> M[Vercel CDN]
    end
```

## Data Pipeline

| Script | npm command | Role |
|--------|------------|------|
| `fetch-github.ts` | `fetch:github` | Queries GitHub Search API for each keyword group; writes `data/_github.json` |
| `fetch-arxiv.ts` | `fetch:arxiv` | Queries arXiv API across configured categories and keywords; writes `data/_arxiv.json` |
| `merge-and-dedupe.ts` | `fetch:merge` | Merges both sources, sorts (stars desc / date desc), writes `data/daily/YYYY-MM-DD.json` and updates `data/index.json` |
| `r2-upload.ts` | `upload:r2` | Uploads `index.json` + all `daily/*.json` to R2; prunes objects older than `DATA_RETENTION_DAYS` |
| `r2-download.ts` | _(prebuild)_ | Downloads `index.json` + each daily file from R2 into `data/` before `next build` |
| `r2-client.ts` | — | Shared S3-compatible client for Cloudflare R2 |
| `config.ts` | — | Keyword groups, arXiv categories, tunable constants |
| `types.ts` | — | Shared TypeScript interfaces (`GitHubItem`, `ArxivItem`, `DailyData`, `IndexManifest`) |

## Environment Variables

### GitHub Actions Secrets

| Secret | Required | Description |
|--------|----------|-------------|
| `GH_PAT` | Yes | GitHub Personal Access Token — used by `fetch-github.ts` for Search API |
| `R2_ENDPOINT` | Yes | Cloudflare R2 S3-compatible endpoint URL |
| `R2_ACCESS_KEY_ID` | Yes | R2 API token access key ID |
| `R2_SECRET_ACCESS_KEY` | Yes | R2 API token secret access key |
| `R2_BUCKET_NAME` | Yes | R2 bucket name |
| `VERCEL_DEPLOY_HOOK` | Yes | Vercel deploy hook URL — triggers a rebuild after upload |

### Vercel Environment Variables

The `prebuild` script (`r2-download.ts`) runs before `next build` on Vercel and needs R2 credentials:

| Variable | Description |
|----------|-------------|
| `R2_ENDPOINT` | Same R2 endpoint as above |
| `R2_ACCESS_KEY_ID` | Same R2 access key |
| `R2_SECRET_ACCESS_KEY` | Same R2 secret key |
| `R2_BUCKET_NAME` | Same R2 bucket name |

Set these in **Vercel → Project Settings → Environment Variables**.

## Content Configuration

All search keywords and constants live in `scripts/config.ts`.

### Keyword Groups (8 groups, shared across GitHub + arXiv)

| Group | Example keywords |
|-------|-----------------|
| `hardware-design` | FPGA, ASIC, RTL, Verilog, SystemVerilog, VHDL |
| `synthesis-pnr` | logic synthesis, place and route, EDA, OpenROAD, yosys |
| `accelerators` | AI accelerator, TPU, NPU, systolic array |
| `model-compression` | quantization, pruning, knowledge distillation |
| `optimization` | HLS, CUDA, kernel optimization, operator fusion |
| `frameworks` | TVM, MLIR, ONNX, TensorRT, OpenVINO, Triton |
| `edge-ai` | TinyML, embedded ML, on-device inference |
| `ai-hardware` | neuromorphic, in-memory computing, photonic computing |

### Tunable Constants

| Constant | Default | Description |
|----------|---------|-------------|
| `REQUEST_DELAY_MS` | `3500` | Delay between API requests (arXiv requires >3 s) |
| `GITHUB_MAX_PAGES` | `1` | Max pages to paginate per keyword group |
| `GITHUB_PER_PAGE` | `20` | Results per GitHub Search API page (max 100) |
| `ARXIV_MAX_RESULTS` | `100` | Max papers per arXiv query |
| `DATA_RETENTION_DAYS` | `365` | R2 objects older than this are pruned on upload |

## Local Development

### Fetching data locally

```bash
export GH_PAT=your_github_personal_access_token
npm run fetch:github
npm run fetch:arxiv
npm run fetch:merge
# or all at once:
npm run fetch:all
```

### Testing R2 locally

Create a `.env` file (git-ignored) with your R2 credentials:

```env
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
```

Then upload or download:

```bash
npm run upload:r2      # upload data/ to R2
npx tsx scripts/r2-download.ts   # download from R2 into data/
```

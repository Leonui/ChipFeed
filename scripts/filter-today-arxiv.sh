#!/usr/bin/env bash
set -euo pipefail

# Download latest daily data from R2
npm run prebuild

# Check for jq
if ! command -v jq &>/dev/null; then
  echo "Error: jq is required but not installed." >&2
  exit 1
fi

DATE=$(date +%Y-%m-%d)
DAILY_FILE="data/daily/${DATE}.json"

if [[ ! -f "$DAILY_FILE" ]]; then
  echo "Error: ${DAILY_FILE} not found." >&2
  exit 1
fi

OUTPUT="data/daily/${DATE}-arxiv.json"

jq '{
  date: .date,
  arxiv: (.arxiv // []),
  scholar: (.scholar // [])
}' "$DAILY_FILE" > "$OUTPUT"

ARXIV_COUNT=$(jq '.arxiv | length' "$OUTPUT")
SCHOLAR_COUNT=$(jq '.scholar | length' "$OUTPUT")
echo "Wrote ${OUTPUT} (arxiv: ${ARXIV_COUNT}, scholar: ${SCHOLAR_COUNT})"

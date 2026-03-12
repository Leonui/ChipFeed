export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MAX_RETRIES = 4;
const INITIAL_BACKOFF_MS = 10_000;
const RETRYABLE_STATUSES = [429, 500, 502, 503];

/**
 * Fetch with exponential backoff retry on transient failures.
 * Returns the raw Response on success, or null after exhausting retries.
 */
export async function fetchWithRetry(
  url: string,
  opts?: RequestInit,
  retries = MAX_RETRIES,
): Promise<Response | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, opts);
      if (res.ok) return res;

      console.warn(`  Attempt ${attempt}/${retries}: HTTP ${res.status} ${res.statusText}`);
      if (RETRYABLE_STATUSES.includes(res.status)) {
        const retryAfter = res.headers.get("retry-after");
        const backoff = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        console.warn(`  Retrying in ${backoff / 1000}s...`);
        await sleep(backoff);
        continue;
      }
      return null;
    } catch (err) {
      console.warn(`  Attempt ${attempt}/${retries}: Network error - ${err}`);
      if (attempt < retries) {
        const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        console.warn(`  Retrying in ${backoff / 1000}s...`);
        await sleep(backoff);
      }
    }
  }
  return null;
}

/**
 * Match text against keyword groups, returning the first matching group name.
 * Falls back to "other" if no group matches.
 */
export function matchGroup(text: string, keywordGroups: Record<string, string[]>): string {
  const lower = text.toLowerCase();
  for (const [group, kws] of Object.entries(keywordGroups)) {
    if (kws.some((kw) => lower.includes(kw.toLowerCase()))) return group;
  }
  return "other";
}

export interface RundownItemBase {
  id: string;
  source: "github" | "arxiv";
  title: string;
  description: string;
  url: string;
  date: string;
  authors: string[];
  tags: string[];
  matchedGroup: string;
}

export interface GitHubItem extends RundownItemBase {
  source: "github";
  stars: number;
  language: string;
  forks: number;
  fullName: string;
}

export interface ArxivItem extends RundownItemBase {
  source: "arxiv";
  arxivId: string;
  pdfUrl: string;
  primaryCategory: string;
}

export type RundownItem = GitHubItem | ArxivItem;

export interface DailyData {
  date: string;
  fetchedAt: string;
  github: GitHubItem[];
  arxiv: ArxivItem[];
}

export interface IndexManifest {
  dates: string[];
  lastUpdated: string;
}

export interface SeenIdRegistry {
  /** Map of item ID → list of ISO date strings when seen */
  ids: Record<string, string[]>;
  lastUpdated: string;
}

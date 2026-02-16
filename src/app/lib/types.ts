export interface RundownItemBase {
  id: string;
  source: "github" | "arxiv" | "scholar";
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

export interface ScholarItem extends RundownItemBase {
  source: "scholar";
  paperId: string;
  citationCount: number;
  publicationVenue: string;
  publicationYear: number;
  fieldsOfStudy: string[];
  externalIds?: { DOI?: string; ArXiv?: string };
}

export type RundownItem = GitHubItem | ArxivItem | ScholarItem;

export interface DailyData {
  date: string;
  fetchedAt: string;
  github: GitHubItem[];
  arxiv: ArxivItem[];
  scholar: ScholarItem[];
}

export interface IndexManifest {
  dates: string[];
  lastUpdated: string;
}

export interface DaySummary {
  date: string;
  github: number;
  arxiv: number;
  scholar: number;
}

export interface MonthGroup {
  month: number;
  label: string;
  days: DaySummary[];
  totals: { github: number; arxiv: number; scholar: number };
}

export interface YearGroup {
  year: number;
  months: MonthGroup[];
  totals: { github: number; arxiv: number; scholar: number };
}

export interface ArchiveData {
  recent: DaySummary[];
  currentYearMonths: MonthGroup[];
  pastYears: YearGroup[];
}

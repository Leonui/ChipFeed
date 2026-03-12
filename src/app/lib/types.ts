// Re-export shared types from the canonical source in scripts/
export type {
  RundownItemBase,
  GitHubItem,
  ArxivItem,
  ScholarItem,
  RundownItem,
  DailyData,
  IndexManifest,
} from "../../../scripts/types";

// Frontend-only types

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

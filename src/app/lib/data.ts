import * as fs from "fs";
import * as path from "path";
import type { DailyData, IndexManifest, YearGroup, MonthGroup, DaySummary, ArchiveData } from "./types";

const dataDir = path.join(process.cwd(), "data");

export function getIndex(): IndexManifest {
  const fp = path.join(dataDir, "index.json");
  return JSON.parse(fs.readFileSync(fp, "utf-8"));
}

export function getDailyData(date: string): DailyData | null {
  const fp = path.join(dataDir, "daily", `${date}.json`);
  try {
    return JSON.parse(fs.readFileSync(fp, "utf-8"));
  } catch {
    return null;
  }
}

export function getLatestDate(): string | null {
  const index = getIndex();
  return index.dates[0] ?? null;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function getArchiveData(): ArchiveData {
  const index = getIndex();

  // Build all DaySummary entries
  const allDays: DaySummary[] = index.dates.map((date) => {
    const daily = getDailyData(date);
    return {
      date,
      github: daily?.github.length ?? 0,
      arxiv: daily?.arxiv.length ?? 0,
      scholar: daily?.scholar?.length ?? 0,
    };
  });

  // Recent: first 7 days
  const recent = allDays.slice(0, 7);
  const remaining = allDays.slice(7);

  // Derive current year from most recent date
  const currentYear = recent.length > 0
    ? Number(recent[0].date.split("-")[0])
    : new Date().getFullYear();

  // Split remaining into current-year vs past-year
  const currentYearDays: DaySummary[] = [];
  const pastYearDays: DaySummary[] = [];
  for (const day of remaining) {
    const y = Number(day.date.split("-")[0]);
    if (y === currentYear) currentYearDays.push(day);
    else pastYearDays.push(day);
  }

  // Group current-year days into MonthGroups
  const currentYearMonths = groupByMonth(currentYearDays, currentYear);

  // Group past-year days into YearGroups
  const yearMap = new Map<number, DaySummary[]>();
  for (const day of pastYearDays) {
    const y = Number(day.date.split("-")[0]);
    if (!yearMap.has(y)) yearMap.set(y, []);
    yearMap.get(y)!.push(day);
  }

  const pastYears: YearGroup[] = [];
  for (const [year, days] of yearMap) {
    const months = groupByMonth(days, year);
    const totals = { github: 0, arxiv: 0, scholar: 0 };
    for (const m of months) {
      totals.github += m.totals.github;
      totals.arxiv += m.totals.arxiv;
      totals.scholar += m.totals.scholar;
    }
    pastYears.push({ year, months, totals });
  }
  pastYears.sort((a, b) => b.year - a.year);

  return { recent, currentYearMonths, pastYears };
}

function groupByMonth(days: DaySummary[], year: number): MonthGroup[] {
  const monthMap = new Map<number, DaySummary[]>();
  for (const day of days) {
    const m = Number(day.date.split("-")[1]);
    if (!monthMap.has(m)) monthMap.set(m, []);
    monthMap.get(m)!.push(day);
  }

  const months: MonthGroup[] = [];
  for (const [month, mDays] of monthMap) {
    const totals = { github: 0, arxiv: 0, scholar: 0 };
    for (const d of mDays) {
      totals.github += d.github;
      totals.arxiv += d.arxiv;
      totals.scholar += d.scholar;
    }
    months.push({
      month,
      label: MONTH_NAMES[month - 1],
      days: mDays.sort((a, b) => b.date.localeCompare(a.date)),
      totals,
    });
  }
  months.sort((a, b) => b.month - a.month);
  return months;
}

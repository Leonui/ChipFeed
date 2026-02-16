"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Github, FileText, BookOpen, CloudSun, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { YearGroup, MonthGroup, DaySummary, ArchiveData } from "../lib/types";

const ease = [0.4, 0, 0.2, 1] as const;

function SourceCounts({ github, arxiv, scholar, className }: {
  github: number; arxiv: number; scholar: number; className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400", className)}>
      <span className="flex items-center gap-1.5">
        <Github className="w-3.5 h-3.5" />
        {github}
      </span>
      <span className="flex items-center gap-1.5">
        <FileText className="w-3.5 h-3.5" />
        {arxiv}
      </span>
      <span className="flex items-center gap-1.5">
        <BookOpen className="w-3.5 h-3.5" />
        {scholar}
      </span>
    </div>
  );
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function DayRow({ day, indent = true }: { day: DaySummary; indent?: boolean }) {
  const isEmpty = day.github === 0 && day.arxiv === 0 && day.scholar === 0;
  const d = new Date(day.date + "T00:00:00");
  const dayNum = d.getUTCDate();
  const weekday = WEEKDAYS[d.getUTCDay()];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.2, ease }}
    >
      <Link
        href={`/day/${day.date}`}
        className={cn(
          "flex items-center justify-between py-2.5 px-4 rounded-lg border border-transparent hover:border-indigo-500/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all group",
          indent && "ml-10"
        )}
      >
        <div className="flex items-center gap-3">
          <span className="w-7 text-right font-semibold text-zinc-700 dark:text-zinc-300 tabular-nums group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {dayNum}
          </span>
          <span className="text-sm text-zinc-400 dark:text-zinc-500">
            {weekday}
          </span>
        </div>
        {isEmpty ? (
          <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full font-medium">
            <CloudSun className="w-3.5 h-3.5" />
            quiet day
          </span>
        ) : (
          <SourceCounts github={day.github} arxiv={day.arxiv} scholar={day.scholar} className="text-xs" />
        )}
      </Link>
    </motion.div>
  );
}

function MonthSection({ month, year, defaultOpen }: {
  month: MonthGroup; year: number; defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="ml-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-2.5 px-4 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2, ease }}
          >
            <ChevronRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          </motion.div>
          <span className="font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {month.label} {year}
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">
            {month.days.length} {month.days.length === 1 ? "day" : "days"}
          </span>
        </div>
        <SourceCounts
          github={month.totals.github}
          arxiv={month.totals.arxiv}
          scholar={month.totals.scholar}
          className="text-xs"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="overflow-hidden"
          >
            <div className="py-1 space-y-0.5">
              {month.days.map((day) => (
                <DayRow key={day.date} day={day} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TopLevelMonth({ month, year, defaultOpen }: {
  month: MonthGroup; year: number; defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2, ease }}
          >
            <ChevronRight className="w-4.5 h-4.5 text-zinc-400 dark:text-zinc-500" />
          </motion.div>
          <span className="font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {month.label} {year}
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">
            {month.days.length} {month.days.length === 1 ? "day" : "days"}
          </span>
        </div>
        <SourceCounts
          github={month.totals.github}
          arxiv={month.totals.arxiv}
          scholar={month.totals.scholar}
          className="text-xs"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="overflow-hidden"
          >
            <div className="py-1 space-y-0.5">
              {month.days.map((day) => (
                <DayRow key={day.date} day={day} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function YearSection({ group }: { group: YearGroup }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-150 dark:hover:bg-zinc-800/70 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2, ease }}
          >
            <ChevronRight className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          </motion.div>
          <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tabular-nums">
            {group.year}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
            <Calendar className="w-3.5 h-3.5" />
            {group.months.length} {group.months.length === 1 ? "month" : "months"}
          </div>
        </div>
        <SourceCounts
          github={group.totals.github}
          arxiv={group.totals.arxiv}
          scholar={group.totals.scholar}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="overflow-hidden"
          >
            <div className="py-2 space-y-1">
              {group.months.map((month) => (
                <MonthSection
                  key={month.month}
                  month={month}
                  year={group.year}
                  defaultOpen={false}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ArchiveTree({ data }: { data: ArchiveData }) {
  const currentYear = data.recent.length > 0
    ? Number(data.recent[0].date.split("-")[0])
    : new Date().getFullYear();

  return (
    <div className="space-y-6">
      {/* Zone 1: Recent days */}
      {data.recent.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3 px-1">
            Recent
          </h2>
          <div className="space-y-0.5">
            {data.recent.map((day) => (
              <DayRow key={day.date} day={day} indent={false} />
            ))}
          </div>
        </section>
      )}

      {/* Zone 2: Current-year months */}
      {data.currentYearMonths.length > 0 && (
        <section className="space-y-2">
          {data.currentYearMonths.map((month, i) => (
            <TopLevelMonth
              key={month.month}
              month={month}
              year={currentYear}
              defaultOpen={i === 0}
            />
          ))}
        </section>
      )}

      {/* Zone 3: Past years */}
      {data.pastYears.length > 0 && (
        <section className="space-y-3">
          {data.pastYears.map((group) => (
            <YearSection key={group.year} group={group} />
          ))}
        </section>
      )}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  sources: string[];
  groups: string[];
  activeSource: string;
  activeGroup: string;
  onSourceChange: (s: string) => void;
  onGroupChange: (g: string) => void;
}

export default function FilterBar({
  sources,
  groups,
  activeSource,
  activeGroup,
  onSourceChange,
  onGroupChange,
}: FilterBarProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Sources */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSourceChange("")}
          className={cn(
            "relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors z-0",
            activeSource === "" 
              ? "text-white" 
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800/50"
          )}
        >
          {activeSource === "" && (
            <motion.div
              layoutId="source-pill"
              className="absolute inset-0 bg-zinc-900 dark:bg-zinc-100 rounded-full -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className={cn(activeSource === "" && "dark:text-zinc-900")}>All Sources</span>
        </button>
        {sources.map((s) => (
          <button
            key={s}
            onClick={() => onSourceChange(s)}
            className={cn(
              "relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors z-0",
              activeSource === s 
                ? "text-white" 
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800/50"
            )}
          >
            {activeSource === s && (
              <motion.div
                layoutId="source-pill"
                className="absolute inset-0 bg-zinc-900 dark:bg-zinc-100 rounded-full -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className={cn(activeSource === s && "dark:text-zinc-900")}>
              {s === "github" ? "GitHub" : s === "arxiv" ? "arXiv" : "Scholar"}
            </span>
          </button>
        ))}
      </div>

      {/* Groups */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onGroupChange("")}
          className={cn(
            "text-xs px-3 py-1 rounded-md border transition-all",
            activeGroup === ""
              ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300 font-medium"
              : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700"
          )}
        >
          All Topics
        </button>
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => onGroupChange(g)}
            className={cn(
              "text-xs px-3 py-1 rounded-md border transition-all",
              activeGroup === g
                ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300 font-medium"
                : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700"
            )}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}

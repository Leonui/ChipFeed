import { getIndex, getDailyData } from "@/app/lib/data";
import Link from "next/link";
import { Github, FileText, CloudSun } from "lucide-react";

export default function ArchivePage() {
  const index = getIndex();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
        Archive
      </h1>
      {index.dates.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No data available yet.</p>
      ) : (
        <div className="space-y-3">
          {index.dates.map((date) => {
            const data = getDailyData(date);
            const ghCount = data?.github.length ?? 0;
            const axCount = data?.arxiv.length ?? 0;
            const isEmpty = ghCount === 0 && axCount === 0;

            return (
              <Link
                key={date}
                href={`/day/${date}`}
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-500/30 hover:shadow-sm transition-all group"
              >
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {date}
                </span>
                {isEmpty ? (
                  <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full font-medium">
                    <CloudSun className="w-3.5 h-3.5" />
                    quiet day
                  </span>
                ) : (
                  <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5" />
                      {ghCount}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      {axCount}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

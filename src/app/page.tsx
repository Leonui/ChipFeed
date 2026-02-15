import { getLatestDate, getDailyData } from "./lib/data";
import DayFeed from "./components/DayFeed";
import { Calendar, Github, FileText, Coffee } from "lucide-react";

export default function Home() {
  const date = getLatestDate();
  if (!date) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-zinc-400" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">No data yet</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Run the fetcher to populate data.</p>
      </div>
    );
  }

  const data = getDailyData(date);
  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500">Could not load data for {date}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
          Today&apos;s Rundown
        </h1>
        <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="font-medium text-zinc-900 dark:text-zinc-200">{date}</span>
          </div>
          <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            <span>{data.github.length} repos</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>{data.arxiv.length} papers</span>
          </div>
        </div>
      </div>
      {data.github.length === 0 && data.arxiv.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-5">
            <Coffee className="w-8 h-8 text-amber-500 dark:text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">All caught up</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
            Nothing new under the sun today. Grab a coffee and enjoy the quiet.
          </p>
        </div>
      ) : (
        <DayFeed data={data} />
      )}
    </div>
  );
}

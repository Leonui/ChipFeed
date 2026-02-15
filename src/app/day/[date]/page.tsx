import { getIndex, getDailyData } from "@/app/lib/data";
import DayFeed from "@/app/components/DayFeed";
import Link from "next/link";
import { CloudSun } from "lucide-react";

export function generateStaticParams() {
  const index = getIndex();
  return index.dates.map((date) => ({ date }));
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const data = getDailyData(date);

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No data for {date}.</p>
        <Link href="/archive" className="text-blue-600 hover:underline mt-2 inline-block">
          Browse archive
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Link href="/archive" className="text-sm text-blue-600 hover:underline">
          Archive
        </Link>
        <span className="text-gray-400">/</span>
      </div>
      <h1 className="text-2xl font-bold mb-1">{date}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {data.github.length} repos &middot; {data.arxiv.length} papers &middot; {(data.scholar ?? []).length} scholar
      </p>
      {data.github.length === 0 && data.arxiv.length === 0 && (data.scholar ?? []).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-sky-50 dark:bg-sky-900/20 rounded-full flex items-center justify-center mb-5">
            <CloudSun className="w-8 h-8 text-sky-500 dark:text-sky-400" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Quiet day</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
            The chips took a break. Nothing new landed on {date}.
          </p>
        </div>
      ) : (
        <DayFeed data={data} />
      )}
    </div>
  );
}

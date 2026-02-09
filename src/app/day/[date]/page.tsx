import { getIndex, getDailyData } from "@/app/lib/data";
import DayFeed from "@/app/components/DayFeed";
import Link from "next/link";

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
        {data.github.length} repos &middot; {data.arxiv.length} papers
      </p>
      <DayFeed data={data} />
    </div>
  );
}

import { getLatestDate, getDailyData } from "./lib/data";
import DayFeed from "./components/DayFeed";

export default function Home() {
  const date = getLatestDate();
  if (!date) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-2">No data yet</h1>
        <p className="text-gray-500">Run the fetcher to populate data.</p>
      </div>
    );
  }

  const data = getDailyData(date);
  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Could not load data for {date}.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Today&apos;s Rundown</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {date} &middot; {data.github.length} repos &middot; {data.arxiv.length} papers
      </p>
      <DayFeed data={data} />
    </div>
  );
}

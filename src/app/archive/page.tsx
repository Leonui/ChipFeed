import { getIndex } from "@/app/lib/data";
import Link from "next/link";

export default function ArchivePage() {
  const index = getIndex();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Archive</h1>
      {index.dates.length === 0 ? (
        <p className="text-gray-500">No data available yet.</p>
      ) : (
        <ul className="space-y-2">
          {index.dates.map((date) => (
            <li key={date}>
              <Link
                href={`/day/${date}`}
                className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {date}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { getArchiveData } from "@/app/lib/data";
import ArchiveTree from "@/app/components/ArchiveTree";

export default function ArchivePage() {
  const data = getArchiveData();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
        Archive
      </h1>
      {data.recent.length === 0 && data.currentYearMonths.length === 0 && data.pastYears.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No data available yet.</p>
      ) : (
        <ArchiveTree data={data} />
      )}
    </div>
  );
}

"use client";


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
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => onSourceChange("")}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            activeSource === ""
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          All Sources
        </button>
        {sources.map((s) => (
          <button
            key={s}
            onClick={() => onSourceChange(s)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              activeSource === s
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {s === "github" ? "GitHub" : "arXiv"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => onGroupChange("")}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            activeGroup === ""
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          All Groups
        </button>
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => onGroupChange(g)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              activeGroup === g
                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import type { DailyData, RundownItem } from "../lib/types";
import NewsCard from "./NewsCard";
import FilterBar from "./FilterBar";
import SearchBar from "./SearchBar";

export default function DayFeed({ data }: { data: DailyData }) {
  const [source, setSource] = useState("");
  const [group, setGroup] = useState("");
  const [search, setSearch] = useState("");

  const allItems: RundownItem[] = useMemo(
    () => [...data.github, ...data.arxiv],
    [data],
  );

  const groups = useMemo(() => {
    const s = new Set(allItems.map((i) => i.matchedGroup));
    return Array.from(s).sort();
  }, [allItems]);

  const filtered = useMemo(() => {
    let items = allItems;
    if (source) items = items.filter((i) => i.source === source);
    if (group) items = items.filter((i) => i.matchedGroup === group);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.authors.some((a) => a.toLowerCase().includes(q)),
      );
    }
    return items;
  }, [allItems, source, group, search]);

  return (
    <div>
      <SearchBar value={search} onChange={setSearch} />
      <FilterBar
        sources={["github", "arxiv"]}
        groups={groups}
        activeSource={source}
        activeGroup={group}
        onSourceChange={setSource}
        onGroupChange={setGroup}
      />
      <p className="text-sm text-gray-500 mb-4">
        Showing {filtered.length} of {allItems.length} items
      </p>
      <div className="grid gap-4">
        {filtered.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-10">
          No items match your filters.
        </p>
      )}
    </div>
  );
}

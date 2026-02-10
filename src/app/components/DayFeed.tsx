"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
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
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 font-medium">
        Showing {filtered.length} of {allItems.length} items
      </p>
      <motion.div 
        layout
        className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
      >
        {filtered.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </motion.div>
      {filtered.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800"
        >
          <p className="text-zinc-500">No items match your filters.</p>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mb-6 group">
      <input
        type="text"
        placeholder="Search for titles, authors, or keywords..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full px-4 py-3 pl-11 rounded-xl transition-all duration-300",
          "bg-white dark:bg-zinc-900",
          "border border-zinc-200 dark:border-zinc-800",
          "text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
          "shadow-sm hover:shadow-md"
        )}
      />
      <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
    </div>
  );
}

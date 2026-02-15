"use client";

import { motion } from "framer-motion";
import { Star, GitFork, BookOpen, ExternalLink, Calendar, User, FileText, Github } from "lucide-react";
import type { RundownItem, GitHubItem, ArxivItem, ScholarItem } from "../lib/types";
import { cn } from "@/lib/utils";

function isGitHub(item: RundownItem): item is GitHubItem {
  return item.source === "github";
}

function isArxiv(item: RundownItem): item is ArxivItem {
  return item.source === "arxiv";
}

function isScholar(item: RundownItem): item is ScholarItem {
  return item.source === "scholar";
}

export default function NewsCard({ item }: { item: RundownItem }) {
  const isGh = isGitHub(item);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative flex flex-col p-5 rounded-xl border transition-all duration-300",
        "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
        "hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 dark:hover:border-indigo-500/30"
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
              isGh
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                : item.source === "arxiv"
                ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                : "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
            )}
          >
            {isGh ? "GitHub" : item.source === "arxiv" ? "arXiv" : "Scholar"}
          </span>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full bg-zinc-50 dark:bg-zinc-800/50">
            {item.matchedGroup}
          </span>
        </div>
        
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <h3 className="font-bold text-lg leading-tight mb-2 text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {item.title}
        </a>
      </h3>

      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4 flex-grow">
        {item.description}
      </p>

      <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-500 mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
        {isGh ? (
          <>
            {item.language && (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                {item.language}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              {item.stars.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              {item.forks.toLocaleString()}
            </span>
          </>
        ) : isScholar(item) ? (
          <>
            <span className="flex items-center gap-1.5 line-clamp-1 max-w-[50%]">
              <User className="w-3.5 h-3.5" />
              {item.authors[0]}
              {item.authors.length > 1 && ` +${item.authors.length - 1}`}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {item.citationCount.toLocaleString()}
            </span>
            {item.publicationVenue && (
              <span className="line-clamp-1 ml-auto text-[10px]">
                {item.publicationVenue}
              </span>
            )}
          </>
        ) : (
          <>
            <span className="flex items-center gap-1.5 line-clamp-1 max-w-[60%]">
              <User className="w-3.5 h-3.5" />
              {item.authors[0]}
              {item.authors.length > 1 && ` +${item.authors.length - 1}`}
            </span>
            <span className="flex items-center gap-1 ml-auto">
               <a
                href={item.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:underline"
              >
                <FileText className="w-3.5 h-3.5" />
                PDF
              </a>
            </span>
          </>
        )}
      </div>
    </motion.article>
  );
}

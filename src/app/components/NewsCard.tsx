"use client";

import type { RundownItem, GitHubItem, ArxivItem } from "../lib/types";

function isGitHub(item: RundownItem): item is GitHubItem {
  return item.source === "github";
}

function isArxiv(item: RundownItem): item is ArxivItem {
  return item.source === "arxiv";
}

function renderDetails(item: RundownItem) {
  if (isGitHub(item)) {
    return (
      <>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
          {item.language && (
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              {item.language}
            </span>
          )}
          <span>&#9733; {item.stars.toLocaleString()}</span>
          <span>Forks: {item.forks.toLocaleString()}</span>
        </div>
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 5).map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </>
    );
  }

  if (isArxiv(item)) {
    return (
      <>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
          {item.description}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {item.authors.slice(0, 3).join(", ")}
          {item.authors.length > 3 && ` +${item.authors.length - 3} more`}
        </p>
        <div className="flex items-center gap-3 mt-2 text-sm">
          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
            {item.primaryCategory}
          </span>
          <a
            href={item.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 dark:text-red-400 hover:underline text-xs font-medium"
          >
            PDF
          </a>
        </div>
      </>
    );
  }

  return null;
}

export default function NewsCard({ item }: { item: RundownItem }) {
  return (
    <article className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              item.source === "github"
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
            }`}>
              {item.source === "github" ? "GitHub" : "arXiv"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {item.matchedGroup}
            </span>
          </div>
          <h3 className="font-semibold text-lg leading-tight">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              {item.title}
            </a>
          </h3>
        </div>
      </div>
      {renderDetails(item)}
    </article>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ContentItem } from "@/lib/types";

interface FilterOption {
  value: string;
  count: number;
}

interface FilterOptions {
  contentTypes: FilterOption[];
  industries: FilterOption[];
  organizations: FilterOption[];
  topics: FilterOption[];
}

interface ActiveFilters {
  type?: string;
  industry?: string;
  client?: string;
  topic?: string;
  q?: string;
}

interface Props {
  items: ContentItem[];
  totalCount: number;
  hasMore: boolean;
  filterOptions: FilterOptions;
  activeFilters: ActiveFilters;
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-orange-100 text-orange-700 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function WorkBrowser({ items, totalCount, hasMore, filterOptions, activeFilters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(activeFilters.q || "");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `/writing?${qs}` : "/writing", { scroll: false });
    },
    [router, searchParams]
  );

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchInput.trim()) {
        params.set("q", searchInput.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `/writing?${qs}` : "/writing", { scroll: false });
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  const showMore = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    const current = parseInt(params.get("page") || "1", 10);
    params.set("page", String(current + 1));
    router.push(`/writing?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const clearFilters = useCallback(() => {
    setSearchInput("");
    router.push("/writing", { scroll: false });
  }, [router]);

  const hasFilters = activeFilters.type || activeFilters.industry || activeFilters.client || activeFilters.topic || activeFilters.q;

  const selectClass = (active: boolean) =>
    `w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat ${
      active ? "border-orange-300 text-orange-700" : "border-gray-200 text-gray-700"
    }`;

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by title, client, topic..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            aria-label="Search content"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="mb-6 grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label htmlFor="filter-type" className="sr-only">Content Type</label>
          <select
            id="filter-type"
            value={activeFilters.type || ""}
            onChange={(e) => updateParam("type", e.target.value || null)}
            className={selectClass(!!activeFilters.type)}
          >
            <option value="">All Types</option>
            {filterOptions.contentTypes.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.value} ({opt.count})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-industry" className="sr-only">Industry</label>
          <select
            id="filter-industry"
            value={activeFilters.industry || ""}
            onChange={(e) => updateParam("industry", e.target.value || null)}
            className={selectClass(!!activeFilters.industry)}
          >
            <option value="">All Industries</option>
            {filterOptions.industries.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.value} ({opt.count})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-client" className="sr-only">Client</label>
          <select
            id="filter-client"
            value={activeFilters.client || ""}
            onChange={(e) => updateParam("client", e.target.value || null)}
            className={selectClass(!!activeFilters.client)}
          >
            <option value="">All Clients</option>
            {filterOptions.organizations.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.value} ({opt.count})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-topic" className="sr-only">Topic</label>
          <select
            id="filter-topic"
            value={activeFilters.topic || ""}
            onChange={(e) => updateParam("topic", e.target.value || null)}
            className={selectClass(!!activeFilters.topic)}
          >
            <option value="">All Topics</option>
            {filterOptions.topics.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.value} ({opt.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <p className="text-sm text-gray-500">
          {totalCount} {totalCount === 1 ? "piece" : "pieces"}
          {hasFilters && " found"}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded px-2 py-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear filters
          </button>
        )}
      </div>

      {/* Content list */}
      <div className="grid gap-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 border border-gray-100 rounded-lg hover:border-orange-200 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-gray-900 group-hover:text-orange-600 transition-colors font-medium leading-snug">
                  {activeFilters.q ? highlightMatch(item.title, activeFilters.q) : item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {item.organization}
                  {item.publication && ` · ${item.publication}`}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
                    {item.contentType}
                  </span>
                  {item.industry?.[0] && (
                    <span className="text-xs text-gray-400">
                      {item.industry[0]}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-xs text-gray-400">
                  {item.published
                    ? new Date(item.published).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </span>
                <svg
                  className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <button
          type="button"
          onClick={showMore}
          className="w-full py-3 mt-6 text-sm text-gray-500 hover:text-orange-500 transition-colors border border-gray-200 rounded-lg hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Show more ({totalCount - items.length} remaining)
        </button>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">No work matches your filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="text-orange-500 hover:text-orange-600 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

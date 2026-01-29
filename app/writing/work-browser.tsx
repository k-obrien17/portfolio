"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import type { ContentItem } from "@/lib/types";

interface Props {
  initialContent: ContentItem[];
}

// Highlight matching text in search results
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

// Get counts for a field
function getCounts(items: ContentItem[], field: keyof ContentItem): Record<string, number> {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    const value = item[field];
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) counts[v] = (counts[v] || 0) + 1;
      });
    } else if (value) {
      counts[value as string] = (counts[value as string] || 0) + 1;
    }
  });
  return counts;
}

// Sort by count descending
function sortByCount(counts: Record<string, number>): string[] {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key);
}

export default function WorkBrowser({ initialContent }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);

  // Read filters from URL
  const selectedContentType = searchParams.get("type");
  const selectedIndustry = searchParams.get("industry");
  const selectedOrganization = searchParams.get("client");
  const selectedTopic = searchParams.get("topic");

  // Update URL when filters change
  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `/writing?${queryString}` : "/writing", { scroll: false });
    setVisibleCount(24);
  }, [router, searchParams]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get unique values and counts
  const contentTypeCounts = useMemo(() => getCounts(initialContent, "contentType"), [initialContent]);
  const industryCounts = useMemo(() => getCounts(initialContent, "industry"), [initialContent]);
  const organizationCounts = useMemo(() => getCounts(initialContent, "organization"), [initialContent]);
  const topicCounts = useMemo(() => getCounts(initialContent, "topics"), [initialContent]);

  // Sorted lists (all items for dropdowns)
  const contentTypes = useMemo(() => sortByCount(contentTypeCounts), [contentTypeCounts]);
  const industries = useMemo(() => sortByCount(industryCounts), [industryCounts]);
  const organizations = useMemo(() => sortByCount(organizationCounts), [organizationCounts]);
  const topics = useMemo(() => sortByCount(topicCounts), [topicCounts]);

  // Setup Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(initialContent, {
      keys: [
        { name: "title", weight: 2 },
        { name: "organization", weight: 1.5 },
        { name: "topics", weight: 1 },
        { name: "industry", weight: 1 },
        { name: "tags", weight: 0.8 },
        { name: "person", weight: 0.5 },
        { name: "publication", weight: 0.5 },
      ],
      threshold: 0.3,
      ignoreLocation: true,
      includeScore: true,
    });
  }, [initialContent]);

  // Filter content
  const filteredContent = useMemo(() => {
    let results = initialContent;

    // Apply search
    if (search.trim()) {
      const searchResults = fuse.search(search);
      results = searchResults.map((r) => r.item);
    }

    // Apply filters
    if (selectedContentType) {
      results = results.filter((item) => item.contentType === selectedContentType);
    }
    if (selectedIndustry) {
      results = results.filter((item) => item.industry?.includes(selectedIndustry));
    }
    if (selectedOrganization) {
      results = results.filter((item) => item.organization === selectedOrganization);
    }
    if (selectedTopic) {
      results = results.filter((item) => item.topics?.includes(selectedTopic));
    }

    return results;
  }, [initialContent, fuse, search, selectedContentType, selectedIndustry, selectedOrganization, selectedTopic]);

  const clearFilters = useCallback(() => {
    setSearch("");
    router.push("/writing", { scroll: false });
    setVisibleCount(24);
  }, [router]);

  const hasFilters = search || selectedContentType || selectedIndustry || selectedOrganization || selectedTopic;

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
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(24);
            }}
            className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            aria-label="Search content"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
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
        {/* Content Type */}
        <div>
          <label htmlFor="filter-type" className="sr-only">Content Type</label>
          <select
            id="filter-type"
            value={selectedContentType || ""}
            onChange={(e) => updateFilters({ type: e.target.value || null })}
            disabled={!mounted}
            className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat ${
              selectedContentType ? "border-orange-300 text-orange-700" : "border-gray-200 text-gray-700"
            }`}
          >
            <option value="">All Types</option>
            {contentTypes.map((type) => (
              <option key={type} value={type}>
                {type} ({contentTypeCounts[type]})
              </option>
            ))}
          </select>
        </div>

        {/* Industry */}
        <div>
          <label htmlFor="filter-industry" className="sr-only">Industry</label>
          <select
            id="filter-industry"
            value={selectedIndustry || ""}
            onChange={(e) => updateFilters({ industry: e.target.value || null })}
            disabled={!mounted}
            className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat ${
              selectedIndustry ? "border-orange-300 text-orange-700" : "border-gray-200 text-gray-700"
            }`}
          >
            <option value="">All Industries</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry} ({industryCounts[industry]})
              </option>
            ))}
          </select>
        </div>

        {/* Client */}
        <div>
          <label htmlFor="filter-client" className="sr-only">Client</label>
          <select
            id="filter-client"
            value={selectedOrganization || ""}
            onChange={(e) => updateFilters({ client: e.target.value || null })}
            disabled={!mounted}
            className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat ${
              selectedOrganization ? "border-orange-300 text-orange-700" : "border-gray-200 text-gray-700"
            }`}
          >
            <option value="">All Clients</option>
            {organizations.map((org) => (
              <option key={org} value={org}>
                {org} ({organizationCounts[org]})
              </option>
            ))}
          </select>
        </div>

        {/* Topic */}
        <div>
          <label htmlFor="filter-topic" className="sr-only">Topic</label>
          <select
            id="filter-topic"
            value={selectedTopic || ""}
            onChange={(e) => updateFilters({ topic: e.target.value || null })}
            disabled={!mounted}
            className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat ${
              selectedTopic ? "border-orange-300 text-orange-700" : "border-gray-200 text-gray-700"
            }`}
          >
            <option value="">All Topics</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic} ({topicCounts[topic]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <p className="text-sm text-gray-500">
          {filteredContent.length} {filteredContent.length === 1 ? "piece" : "pieces"}
          {hasFilters && " found"}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            disabled={!mounted}
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
        {filteredContent.slice(0, visibleCount).map((item) => (
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
                  {search ? highlightMatch(item.title, search) : item.title}
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
      {filteredContent.length > visibleCount && (
        <button
          type="button"
          onClick={() => setVisibleCount((prev) => prev + 24)}
          disabled={!mounted}
          className="w-full py-3 mt-6 text-sm text-gray-500 hover:text-orange-500 transition-colors border border-gray-200 rounded-lg hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Show more ({filteredContent.length - visibleCount} remaining)
        </button>
      )}

      {/* Empty state */}
      {filteredContent.length === 0 && (
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
            disabled={!mounted}
            className="text-orange-500 hover:text-orange-600 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

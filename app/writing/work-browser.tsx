"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
    regex.test(part) ? (
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
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get unique values and counts
  const contentTypeCounts = useMemo(() => getCounts(initialContent, "contentType"), [initialContent]);
  const industryCounts = useMemo(() => getCounts(initialContent, "industry"), [initialContent]);
  const organizationCounts = useMemo(() => getCounts(initialContent, "organization"), [initialContent]);
  const topicCounts = useMemo(() => getCounts(initialContent, "topics"), [initialContent]);

  // Sorted lists
  const contentTypes = useMemo(() => sortByCount(contentTypeCounts), [contentTypeCounts]);
  const industries = useMemo(() => sortByCount(industryCounts), [industryCounts]);
  const organizations = useMemo(() => sortByCount(organizationCounts).slice(0, 15), [organizationCounts]); // Top 15
  const topics = useMemo(() => sortByCount(topicCounts).slice(0, 20), [topicCounts]); // Top 20

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
    setSelectedContentType(null);
    setSelectedIndustry(null);
    setSelectedOrganization(null);
    setSelectedTopic(null);
    setVisibleCount(24);
  }, []);

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

      {/* Content Type Filter (Primary) */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by content type">
          {contentTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setSelectedContentType(selectedContentType === type ? null : type);
                setVisibleCount(24);
              }}
              disabled={!mounted}
              className={`px-3 py-1.5 text-sm rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                selectedContentType === type
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              aria-pressed={selectedContentType === type}
            >
              {type}
              <span className={`ml-1.5 text-xs ${selectedContentType === type ? "text-orange-200" : "text-gray-400"}`}>
                {contentTypeCounts[type]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* More Filters Toggle */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          disabled={!mounted}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showMoreFilters ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showMoreFilters ? "Hide filters" : "More filters"}
        </button>

        {/* Secondary Filters */}
        {showMoreFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
            {/* Industry */}
            {industries.length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Industry</div>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by industry">
                  {industries.map((industry) => (
                    <button
                      key={industry}
                      type="button"
                      onClick={() => {
                        setSelectedIndustry(selectedIndustry === industry ? null : industry);
                        setVisibleCount(24);
                      }}
                      disabled={!mounted}
                      className={`px-2.5 py-1 text-xs rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 ${
                        selectedIndustry === industry
                          ? "bg-gray-800 text-white"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                      aria-pressed={selectedIndustry === industry}
                    >
                      {industry}
                      <span className="ml-1 text-gray-400">{industryCounts[industry]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Client/Organization */}
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Client</div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by client">
                {organizations.map((org) => (
                  <button
                    key={org}
                    type="button"
                    onClick={() => {
                      setSelectedOrganization(selectedOrganization === org ? null : org);
                      setVisibleCount(24);
                    }}
                    disabled={!mounted}
                    className={`px-2.5 py-1 text-xs rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 ${
                      selectedOrganization === org
                        ? "bg-gray-800 text-white"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                    aria-pressed={selectedOrganization === org}
                  >
                    {org}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Topics</div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      setSelectedTopic(selectedTopic === topic ? null : topic);
                      setVisibleCount(24);
                    }}
                    disabled={!mounted}
                    className={`px-2.5 py-1 text-xs rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 ${
                      selectedTopic === topic
                        ? "bg-gray-800 text-white"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                    aria-pressed={selectedTopic === topic}
                  >
                    {topic}
                    <span className="ml-1 text-gray-400">{topicCounts[topic]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
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

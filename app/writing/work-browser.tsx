"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Fuse from "fuse.js";
import type { ContentItem } from "@/lib/types";
import {
  WorkType,
  ProblemArea,
  WORK_TYPES,
  PROBLEM_AREAS,
  getWorkType,
  getProblemArea,
  getWorkTypeOrder,
  getProblemAreaOrder,
  generateSummary,
} from "@/lib/taxonomy";

interface EnrichedContent extends ContentItem {
  workType: WorkType;
  problemArea: ProblemArea;
  summary: string;
}

interface Props {
  initialContent: ContentItem[];
  topClients: string[];
}

// Highlight matching text
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

export default function WorkBrowser({ initialContent, topClients }: Props) {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedWorkType, setSelectedWorkType] = useState<WorkType | null>(null);
  const [selectedProblemArea, setSelectedProblemArea] = useState<ProblemArea | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [showSecondaryFilters, setShowSecondaryFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Enrich content with taxonomy
  const enrichedContent = useMemo((): EnrichedContent[] => {
    return initialContent.map((item) => ({
      ...item,
      workType: getWorkType(item.contentType),
      problemArea: getProblemArea(item.topics, item.tags),
      summary: generateSummary(item.title, item.organization, item.contentType, item.tags),
    }));
  }, [initialContent]);

  // Setup Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(enrichedContent, {
      keys: [
        { name: "title", weight: 2 },
        { name: "organization", weight: 1.5 },
        { name: "summary", weight: 1 },
        { name: "tags", weight: 0.8 },
        { name: "person", weight: 0.5 },
        { name: "publication", weight: 0.5 },
      ],
      threshold: 0.3,
      ignoreLocation: true,
      includeScore: true,
    });
  }, [enrichedContent]);

  // Count items per work type
  const workTypeCounts = useMemo(() => {
    const counts: Record<WorkType, number> = {} as Record<WorkType, number>;
    getWorkTypeOrder().forEach((type) => (counts[type] = 0));
    enrichedContent.forEach((item) => {
      counts[item.workType] = (counts[item.workType] || 0) + 1;
    });
    return counts;
  }, [enrichedContent]);

  // Count items per problem area
  const problemAreaCounts = useMemo(() => {
    const counts: Record<ProblemArea, number> = {} as Record<ProblemArea, number>;
    getProblemAreaOrder().forEach((area) => (counts[area] = 0));
    enrichedContent.forEach((item) => {
      counts[item.problemArea] = (counts[item.problemArea] || 0) + 1;
    });
    return counts;
  }, [enrichedContent]);

  // Filter and search
  const filteredContent = useMemo(() => {
    let results = enrichedContent;

    // Apply search
    if (search.trim()) {
      const searchResults = fuse.search(search);
      results = searchResults.map((r) => r.item);
    }

    // Apply work type filter
    if (selectedWorkType) {
      results = results.filter((item) => item.workType === selectedWorkType);
    }

    // Apply problem area filter
    if (selectedProblemArea) {
      results = results.filter((item) => item.problemArea === selectedProblemArea);
    }

    // Apply client filter
    if (selectedClient) {
      results = results.filter((item) => item.organization === selectedClient);
    }

    return results;
  }, [enrichedContent, fuse, search, selectedWorkType, selectedProblemArea, selectedClient]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedWorkType(null);
    setSelectedProblemArea(null);
    setSelectedClient(null);
    setVisibleCount(24);
  }, []);

  const hasFilters = search || selectedWorkType || selectedProblemArea || selectedClient;

  const handleWorkTypeClick = (type: WorkType) => {
    setSelectedWorkType(selectedWorkType === type ? null : type);
    setVisibleCount(24);
  };

  const handleProblemAreaClick = (area: ProblemArea) => {
    setSelectedProblemArea(selectedProblemArea === area ? null : area);
    setVisibleCount(24);
  };

  const handleClientClick = (client: string) => {
    setSelectedClient(selectedClient === client ? null : client);
    setVisibleCount(24);
  };

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

      {/* Primary Filter: Work Type */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by work type">
          {getWorkTypeOrder().map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleWorkTypeClick(type)}
              disabled={!mounted}
              className={`px-3 py-1.5 text-sm rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                selectedWorkType === type
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              aria-pressed={selectedWorkType === type}
            >
              {WORK_TYPES[type].label}
              <span className={`ml-1.5 text-xs ${selectedWorkType === type ? "text-orange-200" : "text-gray-400"}`}>
                {workTypeCounts[type]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Filters Toggle */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowSecondaryFilters(!showSecondaryFilters)}
          disabled={!mounted}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showSecondaryFilters ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {showSecondaryFilters ? "Hide filters" : "More filters"}
        </button>

        {/* Secondary Filters */}
        {showSecondaryFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
            {/* Problem Area */}
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Problem Area</div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by problem area">
                {getProblemAreaOrder()
                  .filter((area) => problemAreaCounts[area] > 0)
                  .map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => handleProblemAreaClick(area)}
                      disabled={!mounted}
                      className={`px-2.5 py-1 text-xs rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 ${
                        selectedProblemArea === area
                          ? "bg-gray-800 text-white"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                      aria-pressed={selectedProblemArea === area}
                    >
                      {PROBLEM_AREAS[area].label}
                      <span className={`ml-1 ${selectedProblemArea === area ? "text-gray-400" : "text-gray-400"}`}>
                        {problemAreaCounts[area]}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Client */}
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Client</div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by client">
                {topClients.map((client) => (
                  <button
                    key={client}
                    type="button"
                    onClick={() => handleClientClick(client)}
                    disabled={!mounted}
                    className={`px-2.5 py-1 text-xs rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 ${
                      selectedClient === client
                        ? "bg-gray-800 text-white"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                    aria-pressed={selectedClient === client}
                  >
                    {client}
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

      {/* Content grid */}
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
                  {search ? highlightMatch(item.summary, search) : item.summary}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700">
                    {WORK_TYPES[item.workType].label}
                  </span>
                  <span className="text-xs text-gray-400">
                    {item.organization}
                  </span>
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

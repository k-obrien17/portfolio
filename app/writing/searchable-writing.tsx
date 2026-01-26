"use client";

import { useState, useMemo, useEffect } from "react";
import type { ContentItem } from "@/lib/types";

interface Props {
  initialContent: ContentItem[];
  contentTypes: string[];
  publications: string[];
  organizations: string[];
  tags: string[];
}

export default function SearchableWriting({
  initialContent,
  contentTypes,
  organizations,
  tags,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const [visibleCount, setVisibleCount] = useState(30);

  // Ensure component is mounted before enabling interactions
  useEffect(() => {
    setMounted(true);
  }, []);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    initialContent.forEach((item) => {
      item.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, [initialContent]);

  const sortedTags = useMemo(() => {
    return [...tags].sort((a, b) => (tagCounts[b] || 0) - (tagCounts[a] || 0));
  }, [tags, tagCounts]);

  const filteredContent = useMemo(() => {
    return initialContent.filter((item) => {
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          item.title.toLowerCase().includes(searchLower) ||
          item.person.toLowerCase().includes(searchLower) ||
          item.organization.toLowerCase().includes(searchLower) ||
          item.publication.toLowerCase().includes(searchLower) ||
          item.topics.some((t) => t.toLowerCase().includes(searchLower)) ||
          item.tags.some((t) => t.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      if (selectedType && item.contentType !== selectedType) return false;
      if (selectedOrg && item.organization !== selectedOrg) return false;
      if (selectedTag && !item.tags.includes(selectedTag)) return false;

      return true;
    });
  }, [initialContent, search, selectedType, selectedOrg, selectedTag]);

  const clearFilters = () => {
    setSearch("");
    setSelectedType(null);
    setSelectedOrg(null);
    setSelectedTag(null);
    setVisibleCount(30);
  };

  const hasFilters = search || selectedType || selectedOrg || selectedTag;
  const displayedTags = showAllTags ? sortedTags : sortedTags.slice(0, 20);

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value || null);
  };

  const handleOrgChange = (value: string) => {
    setSelectedOrg(value || null);
  };

  return (
    <div>
      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by title, client, publication, or topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 text-sm border-b border-gray-200 focus:outline-none focus:border-orange-500 transition-colors bg-transparent"
          aria-label="Search content"
        />
      </div>

      {/* Tags */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-x-3 gap-y-2" role="group" aria-label="Filter by tag">
          {displayedTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              disabled={!mounted}
              className={`text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded px-1 ${
                selectedTag === tag
                  ? "text-orange-600 font-medium"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              aria-pressed={selectedTag === tag}
            >
              {tag}
              <span className="text-gray-300 ml-1 text-xs">({tagCounts[tag]})</span>
            </button>
          ))}
          {sortedTags.length > 20 && (
            <button
              type="button"
              onClick={() => setShowAllTags(!showAllTags)}
              disabled={!mounted}
              className="text-sm text-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded px-1"
            >
              {showAllTags ? "show less" : `+${sortedTags.length - 20} more`}
            </button>
          )}
        </div>
      </div>

      {/* Type and Org filters */}
      <div className="flex flex-wrap gap-4 mb-8 text-sm">
        <select
          value={selectedType || ""}
          onChange={(e) => handleTypeChange(e.target.value)}
          disabled={!mounted}
          className="px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-700"
          aria-label="Filter by content type"
        >
          <option value="">All types</option>
          {contentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={selectedOrg || ""}
          onChange={(e) => handleOrgChange(e.target.value)}
          disabled={!mounted}
          className="px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-700"
          aria-label="Filter by client"
        >
          <option value="">All clients</option>
          {organizations.map((org) => (
            <option key={org} value={org}>
              {org}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            disabled={!mounted}
            className="text-gray-400 hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded px-2"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500 mb-6">
        {filteredContent.length} {filteredContent.length === 1 ? "piece" : "pieces"}
        {hasFilters && " found"}
      </p>

      {/* Content list */}
      <div className="space-y-1">
        {filteredContent.slice(0, visibleCount).map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group py-4 border-b border-gray-100 hover:bg-gray-50 -mx-4 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset rounded"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-gray-900 group-hover:text-orange-600 transition-colors font-medium">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {item.organization}
                  {item.publication && item.publication !== "LinkedIn" && ` · ${item.publication}`}
                  {item.contentType && ` · ${item.contentType}`}
                </p>
              </div>
              <span className="text-xs text-gray-400 shrink-0 pt-1">
                {item.published
                  ? new Date(item.published).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
              </span>
            </div>
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="text-xs text-gray-300">+{item.tags.length - 3}</span>
                )}
              </div>
            )}
          </a>
        ))}
      </div>

      {/* Load more */}
      {filteredContent.length > visibleCount && (
        <button
          type="button"
          onClick={() => setVisibleCount((prev) => prev + 30)}
          disabled={!mounted}
          className="w-full py-4 mt-8 text-sm text-gray-500 hover:text-orange-500 transition-colors border border-gray-200 rounded-lg hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Load more ({filteredContent.length - visibleCount} remaining)
        </button>
      )}

      {filteredContent.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="mb-4">No content matches your filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            disabled={!mounted}
            className="text-orange-500 hover:text-orange-600 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}

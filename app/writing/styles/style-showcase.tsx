"use client";

import { useState, useMemo, memo } from "react";
import type { ContentItem, ContentFilters, ContentCounts, ActiveFilters } from "@/lib/types";
import { filterContent } from "@/lib/types";

interface StyleProps {
  filtered: ContentItem[];
  filters: ContentFilters;
  counts: ContentCounts;
  activeFilters: ActiveFilters;
  setFilter: (key: keyof ActiveFilters, value: string | null) => void;
}

// Style 1: Clean Minimal List
const StyleMinimalList = memo(function StyleMinimalList({ filtered, filters, counts, activeFilters, setFilter }: StyleProps) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Filter sections */}
      <div className="space-y-4 border-b border-gray-100 pb-6 mb-8">
        {/* Content Type */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-300 w-16 shrink-0">Type</span>
          <button
            onClick={() => setFilter('contentType', null)}
            className={`text-sm transition-colors ${!activeFilters.contentType ? "text-gray-900 font-medium" : "text-gray-400 hover:text-gray-600"}`}
          >
            All
          </button>
          {filters.contentTypes.slice(0, 8).map(type => (
            <button
              key={type}
              onClick={() => setFilter('contentType', activeFilters.contentType === type ? null : type)}
              className={`text-sm transition-colors ${activeFilters.contentType === type ? "text-gray-900 font-medium" : "text-gray-400 hover:text-gray-600"}`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Organization */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-300 w-16 shrink-0">Client</span>
          <button
            onClick={() => setFilter('organization', null)}
            className={`text-sm transition-colors ${!activeFilters.organization ? "text-gray-900 font-medium" : "text-gray-400 hover:text-gray-600"}`}
          >
            All
          </button>
          {filters.organizations.slice(0, 8).map(org => (
            <button
              key={org}
              onClick={() => setFilter('organization', activeFilters.organization === org ? null : org)}
              className={`text-sm transition-colors ${activeFilters.organization === org ? "text-gray-900 font-medium" : "text-gray-400 hover:text-gray-600"}`}
            >
              {org}
            </button>
          ))}
        </div>

        {/* Industry */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-300 w-16 shrink-0">Industry</span>
          <button
            onClick={() => setFilter('industry', null)}
            className={`text-sm transition-colors ${!activeFilters.industry ? "text-gray-900 font-medium" : "text-gray-400 hover:text-gray-600"}`}
          >
            All
          </button>
          {filters.industries.map(ind => (
            <button
              key={ind}
              onClick={() => setFilter('industry', activeFilters.industry === ind ? null : ind)}
              className={`text-sm transition-colors ${activeFilters.industry === ind ? "text-gray-900 font-medium" : "text-gray-400 hover:text-gray-600"}`}
            >
              {ind}
            </button>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-300 w-16 shrink-0">Tags</span>
          {filters.tags.slice(0, 15).map(tag => (
            <button
              key={tag}
              onClick={() => setFilter('tag', activeFilters.tag === tag ? null : tag)}
              className={`text-sm transition-colors ${activeFilters.tag === tag ? "text-gray-900 font-medium" : "text-gray-400 hover:text-gray-600"}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-6">{filtered.length} pieces</p>

      {/* Content list */}
      <div className="space-y-6">
        {filtered.slice(0, 30).map(item => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-gray-900 group-hover:text-gray-600 transition-colors truncate">
                {item.title}
              </h3>
              <span className="text-sm text-gray-300 shrink-0">
                {item.published ? new Date(item.published).getFullYear() : ""}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {item.organization} · {item.contentType}
            </p>
          </a>
        ))}
      </div>

      {filtered.length > 30 && (
        <p className="text-center text-gray-400 text-sm mt-8">
          Showing 30 of {filtered.length} pieces
        </p>
      )}
    </div>
  );
});

// Style 2: Magazine Editorial
const StyleMagazine = memo(function StyleMagazine({ filtered, filters, counts, activeFilters, setFilter }: StyleProps) {
  const featured = filtered.slice(0, 3);
  const rest = filtered.slice(3, 23);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Filter pills */}
      <div className="space-y-3 mb-12">
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-gray-400 mr-2 py-1">Type:</span>
          {filters.contentTypes.slice(0, 6).map(type => (
            <button
              key={type}
              onClick={() => setFilter('contentType', activeFilters.contentType === type ? null : type)}
              className={`px-2.5 py-1 text-xs rounded-full transition-all ${
                activeFilters.contentType === type
                  ? "bg-gray-900 text-white"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-gray-400 mr-2 py-1">Industry:</span>
          {filters.industries.map(ind => (
            <button
              key={ind}
              onClick={() => setFilter('industry', activeFilters.industry === ind ? null : ind)}
              className={`px-2.5 py-1 text-xs rounded-full transition-all ${
                activeFilters.industry === ind
                  ? "bg-gray-900 text-white"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs text-gray-400 mr-2 py-1">Tags:</span>
          {filters.tags.slice(0, 20).map(tag => (
            <button
              key={tag}
              onClick={() => setFilter('tag', activeFilters.tag === tag ? null : tag)}
              className={`px-2.5 py-1 text-xs rounded-full transition-all ${
                activeFilters.tag === tag
                  ? "bg-gray-900 text-white"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Featured grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {featured.map(item => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4" />
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
              {item.publication || item.contentType}
            </p>
            <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
              {item.title}
            </h3>
          </a>
        ))}
      </div>

      {/* Rest as simple list */}
      <div className="border-t border-gray-100 pt-8">
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
          {rest.map(item => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-baseline gap-3 group py-2"
            >
              <span className="text-gray-300 text-sm shrink-0">
                {item.published ? new Date(item.published).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : ""}
              </span>
              <span className="text-gray-700 group-hover:text-gray-500 transition-colors truncate">
                {item.title}
              </span>
            </a>
          ))}
        </div>
      </div>

      <p className="text-center text-gray-300 text-sm mt-12">
        {filtered.length} pieces total
      </p>
    </div>
  );
});

// Style 3: Tag Cloud Focus
const StyleTagCloud = memo(function StyleTagCloud({ filtered, filters, counts, activeFilters, setFilter }: StyleProps) {
  const maxTagCount = Math.max(...Object.values(counts.tags));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Secondary filters at top */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 pb-8 border-b border-gray-100">
        <select
          value={activeFilters.contentType || ''}
          onChange={(e) => setFilter('contentType', e.target.value || null)}
          className="text-sm text-gray-500 bg-transparent border-b border-gray-200 focus:outline-none focus:border-gray-400 py-1"
        >
          <option value="">All types</option>
          {filters.contentTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select
          value={activeFilters.organization || ''}
          onChange={(e) => setFilter('organization', e.target.value || null)}
          className="text-sm text-gray-500 bg-transparent border-b border-gray-200 focus:outline-none focus:border-gray-400 py-1"
        >
          <option value="">All clients</option>
          {filters.organizations.map(org => (
            <option key={org} value={org}>{org}</option>
          ))}
        </select>
        <select
          value={activeFilters.industry || ''}
          onChange={(e) => setFilter('industry', e.target.value || null)}
          className="text-sm text-gray-500 bg-transparent border-b border-gray-200 focus:outline-none focus:border-gray-400 py-1"
        >
          <option value="">All industries</option>
          {filters.industries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      {/* Tag cloud */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-16">
        {filters.tags.map(tag => {
          const size = 0.75 + (counts.tags[tag] / maxTagCount) * 0.5;
          return (
            <button
              key={tag}
              onClick={() => setFilter('tag', activeFilters.tag === tag ? null : tag)}
              style={{ fontSize: `${size}rem` }}
              className={`transition-colors ${
                activeFilters.tag === tag
                  ? "text-gray-900 font-medium"
                  : activeFilters.tag
                    ? "text-gray-200"
                    : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Filtered results */}
      {activeFilters.tag && (
        <div className="text-center mb-8">
          <span className="text-2xl font-light text-gray-900">{filtered.length}</span>
          <span className="text-gray-400 ml-2">pieces tagged "{activeFilters.tag}"</span>
        </div>
      )}

      <div className="space-y-3">
        {filtered.slice(0, 25).map(item => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-gray-900 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-400">
              {item.organization} · {item.publication} · {item.published ? new Date(item.published).getFullYear() : ""}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
});

// Style 4: Dense Grid with Tabs
const StyleDenseGrid = memo(function StyleDenseGrid({ filtered, filters, counts, activeFilters, setFilter }: StyleProps) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Tabs for content type */}
      <div className="overflow-x-auto pb-4 mb-4 -mx-6 px-6 border-b border-gray-100">
        <div className="flex gap-6 min-w-max">
          <button
            onClick={() => setFilter('contentType', null)}
            className={`text-sm whitespace-nowrap pb-2 border-b-2 transition-colors ${
              !activeFilters.contentType
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            All Work
          </button>
          {filters.contentTypes.slice(0, 10).map(type => (
            <button
              key={type}
              onClick={() => setFilter('contentType', activeFilters.contentType === type ? null : type)}
              className={`text-sm whitespace-nowrap pb-2 border-b-2 transition-colors ${
                activeFilters.contentType === type
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={activeFilters.organization || ''}
          onChange={(e) => setFilter('organization', e.target.value || null)}
          className="text-xs text-gray-500 bg-transparent border border-gray-200 rounded px-2 py-1 focus:outline-none"
        >
          <option value="">All clients</option>
          {filters.organizations.map(org => (
            <option key={org} value={org}>{org}</option>
          ))}
        </select>
        <select
          value={activeFilters.industry || ''}
          onChange={(e) => setFilter('industry', e.target.value || null)}
          className="text-xs text-gray-500 bg-transparent border border-gray-200 rounded px-2 py-1 focus:outline-none"
        >
          <option value="">All industries</option>
          {filters.industries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
        <select
          value={activeFilters.tag || ''}
          onChange={(e) => setFilter('tag', e.target.value || null)}
          className="text-xs text-gray-500 bg-transparent border border-gray-200 rounded px-2 py-1 focus:outline-none"
        >
          <option value="">All tags</option>
          {filters.tags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-gray-400 mb-4">{filtered.length} pieces</p>

      {/* Dense grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
        {filtered.slice(0, 30).map(item => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-5 hover:bg-gray-50 transition-colors"
          >
            <p className="text-xs text-gray-400 mb-2">
              {item.contentType} · {item.organization}
            </p>
            <h3 className="text-sm text-gray-900 font-medium line-clamp-2 mb-2">
              {item.title}
            </h3>
            <div className="flex gap-1.5 flex-wrap">
              {item.tags?.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs text-gray-300">
                  #{tag.replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
});

interface Props {
  content: ContentItem[];
  filters: ContentFilters;
  counts: ContentCounts;
}

const defaultFilters: ActiveFilters = {
  contentType: null,
  organization: null,
  publication: null,
  industry: null,
  tag: null,
};

export default function StyleShowcase({ content, filters, counts }: Props) {
  const [activeStyle, setActiveStyle] = useState(0);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(defaultFilters);

  // Memoize filtered content - computed once, used by all style components
  const filtered = useMemo(
    () => filterContent(content, activeFilters),
    [content, activeFilters]
  );

  const setFilter = (key: keyof ActiveFilters, value: string | null) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setActiveFilters(defaultFilters);
  };

  const hasActiveFilters = Object.values(activeFilters).some(v => v !== null);

  const styles = [
    { name: "Minimal List", component: StyleMinimalList },
    { name: "Magazine", component: StyleMagazine },
    { name: "Tag Cloud", component: StyleTagCloud },
    { name: "Dense Grid", component: StyleDenseGrid },
  ];

  const ActiveComponent = styles[activeStyle].component;

  return (
    <div className="min-h-screen bg-white">
      {/* Style switcher */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-sm font-medium text-gray-900">Writing</h1>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear filters
                </button>
              )}
            </div>
            <div className="flex gap-1">
              {styles.map((style, i) => (
                <button
                  key={style.name}
                  onClick={() => setActiveStyle(i)}
                  className={`px-3 py-1.5 text-xs rounded transition-colors ${
                    activeStyle === i
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="px-6 py-12">
        <ActiveComponent
          filtered={filtered}
          filters={filters}
          counts={counts}
          activeFilters={activeFilters}
          setFilter={setFilter}
        />
      </div>
    </div>
  );
}

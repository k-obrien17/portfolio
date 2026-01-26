"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { ContentItem } from "@/lib/types";

interface Filters {
  contentTypes: string[];
  publications: string[];
  organizations: string[];
  tags: string[];
}

export default function AdminContentList() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filters, setFilters] = useState<Filters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [orgFilter, setOrgFilter] = useState("");
  const [dbInitialized, setDbInitialized] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/admin/content");
      if (!res.ok) {
        if (res.status === 500) {
          // Database might not be initialized
          setDbInitialized(false);
          setLoading(false);
          return;
        }
        throw new Error("Failed to fetch content");
      }
      const data = await res.json();
      setContent(data.content || []);
      setFilters(data.filters || null);
      setDbInitialized(true);
    } catch (err) {
      setError("Failed to load content");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initializeDb = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        fetchContent();
      } else {
        setError(data.error || "Failed to initialize database");
      }
    } catch (err) {
      setError("Failed to initialize database");
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
      if (res.ok) {
        setContent(content.filter((item) => item.id !== id));
      } else {
        alert("Failed to delete item");
      }
    } catch (err) {
      alert("Failed to delete item");
      console.error(err);
    }
  };

  // Filter content
  const filteredContent = content.filter((item) => {
    if (search) {
      const searchLower = search.toLowerCase();
      const matches =
        item.title.toLowerCase().includes(searchLower) ||
        item.person?.toLowerCase().includes(searchLower) ||
        item.organization?.toLowerCase().includes(searchLower) ||
        item.tags?.some((t) => t.toLowerCase().includes(searchLower));
      if (!matches) return false;
    }
    if (typeFilter && item.contentType !== typeFilter) return false;
    if (orgFilter && item.organization !== orgFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!dbInitialized) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">
          Database Not Initialized
        </h2>
        <p className="text-yellow-700 mb-4">
          The database needs to be initialized and seeded with your content data.
        </p>
        <button
          onClick={initializeDb}
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
        >
          Initialize Database & Import Content
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchContent}
          className="mt-2 text-red-600 underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-1.5 text-sm border-b border-gray-200 focus:outline-none focus:border-gray-400 bg-transparent"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2 py-1.5 text-sm border-b border-gray-200 focus:outline-none focus:border-gray-400 bg-transparent text-gray-600"
          >
            <option value="">All types</option>
            {filters?.contentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value)}
            className="px-2 py-1.5 text-sm border-b border-gray-200 focus:outline-none focus:border-gray-400 bg-transparent text-gray-600"
          >
            <option value="">All clients</option>
            {filters?.organizations.map((org) => (
              <option key={org} value={org}>
                {org}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-400">
            {filteredContent.length} of {content.length}
          </p>
          <Link
            href="/admin/new"
            className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
          >
            + New
          </Link>
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-1">
        {filteredContent.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 border-b border-gray-50 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors group"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-300 w-16 shrink-0">
                  {item.contentType}
                </span>
                <span className="text-sm text-gray-900 truncate">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="w-16 shrink-0" />
                <span className="text-xs text-gray-400">
                  {item.organization}
                  {item.published && ` · ${new Date(item.published).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                href={`/admin/${item.id}`}
                className="text-xs text-gray-500 hover:text-gray-900"
              >
                Edit
              </Link>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                View
              </a>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-xs text-gray-300 hover:text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredContent.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">
            No content found.
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ContentItem } from "@/lib/types";

const CONTENT_TYPES = [
  "Blog",
  "Byline",
  "LinkedIn post",
  "Interview",
  "Topic Page",
  "Sponsored Content",
  "White Paper",
  "Case Study",
  "Report",
  "Newsletter",
  "Annual Report",
  "Web Page/Website",
  "Sales Deck",
];

export default function ContentForm({ contentId }: { contentId?: string }) {
  const router = useRouter();
  const isEdit = Boolean(contentId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<Partial<ContentItem>>({
    title: "",
    url: "",
    published: "",
    contentType: "",
    publication: "",
    person: "",
    organization: "",
    topics: [],
    tags: [],
  });

  const [tagsInput, setTagsInput] = useState("");
  const [topicsInput, setTopicsInput] = useState("");

  useEffect(() => {
    if (isEdit && contentId) {
      fetchContent();
    }
  }, [contentId, isEdit]);

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/admin/content/${contentId}`);
      if (!res.ok) throw new Error("Failed to fetch content");
      const data = await res.json();
      setFormData(data);
      setTagsInput(data.tags?.join(", ") || "");
      setTopicsInput(data.topics?.join(", ") || "");
    } catch (err) {
      setError("Failed to load content");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    // Parse tags and topics from comma-separated strings
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const topics = topicsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags,
      topics,
    };

    try {
      const url = isEdit
        ? `/api/admin/content/${contentId}`
        : "/api/admin/content";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save content");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* URL */}
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            URL *
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Content Type */}
          <div>
            <label
              htmlFor="contentType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content Type
            </label>
            <select
              id="contentType"
              name="contentType"
              value={formData.contentType || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select type...</option>
              {CONTENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Published Date */}
          <div>
            <label
              htmlFor="published"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Published Date
            </label>
            <input
              type="date"
              id="published"
              name="published"
              value={formData.published?.split("T")[0] || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Organization */}
          <div>
            <label
              htmlFor="organization"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Organization / Client
            </label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Person */}
          <div>
            <label
              htmlFor="person"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Person / Author
            </label>
            <input
              type="text"
              id="person"
              name="person"
              value={formData.person || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Publication */}
        <div>
          <label
            htmlFor="publication"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Publication
          </label>
          <input
            type="text"
            id="publication"
            name="publication"
            value={formData.publication || ""}
            onChange={handleChange}
            placeholder="e.g., Forbes, TechCrunch, Company Blog"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Comma-separated tags (e.g., AI, Marketing, B2B)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate multiple tags with commas
          </p>
        </div>

        {/* Topics */}
        <div>
          <label
            htmlFor="topics"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Topics
          </label>
          <textarea
            id="topics"
            value={topicsInput}
            onChange={(e) => setTopicsInput(e.target.value)}
            placeholder="Comma-separated topics"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Separate multiple topics with commas
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Content"}
        </button>
      </div>
    </form>
  );
}

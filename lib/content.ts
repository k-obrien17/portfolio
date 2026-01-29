import rawContentData from "@/data/content.json";
import { ContentItem } from "./types";

// Cast imported JSON to proper type
const contentData = rawContentData as ContentItem[];

// Re-export types for convenience
export type { ContentItem } from "./types";
export { getIndustriesFromTopics } from "./types";

// Alias for backward compatibility
export type ContentPiece = ContentItem;

// Get all published content sorted by date
export function getPublishedContent(): ContentPiece[] {
  return [...contentData].sort((a, b) => {
    const dateA = a.published ? new Date(a.published).getTime() : 0;
    const dateB = b.published ? new Date(b.published).getTime() : 0;
    return dateB - dateA;
  });
}

// Get content by ID
export function getContentById(id: string): ContentPiece | null {
  return contentData.find((c) => c.id === id) || null;
}

// Search content by query
export function searchContent(query: string): ContentPiece[] {
  const lowerQuery = query.toLowerCase();

  return contentData.filter((piece) => {
    return (
      piece.title?.toLowerCase().includes(lowerQuery) ||
      piece.publication?.toLowerCase().includes(lowerQuery) ||
      piece.person?.toLowerCase().includes(lowerQuery) ||
      piece.organization?.toLowerCase().includes(lowerQuery) ||
      piece.topics?.some((t) => t.toLowerCase().includes(lowerQuery)) ||
      piece.tags?.some((t) => t.toLowerCase().includes(lowerQuery))
    );
  });
}

// Get unique content types
export function getContentTypes(): string[] {
  const types = new Set(contentData.map((c) => c.contentType));
  return [...types].sort();
}

// Get unique publications
export function getPublications(): string[] {
  const pubs = new Set(contentData.map((c) => c.publication));
  return [...pubs].sort();
}

// Get unique organizations
export function getOrganizations(): string[] {
  const orgs = new Set(contentData.map((c) => c.organization));
  return [...orgs].sort();
}

// Get all unique topics
export function getTopics(): string[] {
  const topics = new Set(contentData.flatMap((c) => c.topics));
  return [...topics].sort();
}

// Get all unique tags
export function getTags(): string[] {
  const tags = new Set(contentData.flatMap((c) => c.tags));
  return [...tags].sort();
}

// Filter content by various criteria
export function filterContent(filters: {
  contentType?: string;
  publication?: string;
  organization?: string;
  topic?: string;
  tag?: string;
}): ContentPiece[] {
  return contentData.filter((piece) => {
    if (filters.contentType && piece.contentType !== filters.contentType) {
      return false;
    }
    if (filters.publication && piece.publication !== filters.publication) {
      return false;
    }
    if (filters.organization && piece.organization !== filters.organization) {
      return false;
    }
    if (filters.topic && !piece.topics?.includes(filters.topic)) {
      return false;
    }
    if (filters.tag && !piece.tags?.includes(filters.tag)) {
      return false;
    }
    return true;
  });
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Get filter dropdown options with counts from the full dataset
export function getContentFilterOptions() {
  const typeCounts: Record<string, number> = {};
  const industryCounts: Record<string, number> = {};
  const orgCounts: Record<string, number> = {};
  const topicCounts: Record<string, number> = {};

  contentData.forEach((item) => {
    if (item.contentType) typeCounts[item.contentType] = (typeCounts[item.contentType] || 0) + 1;
    if (item.organization) orgCounts[item.organization] = (orgCounts[item.organization] || 0) + 1;
    if (item.industry) {
      item.industry.forEach((ind) => {
        if (ind) industryCounts[ind] = (industryCounts[ind] || 0) + 1;
      });
    }
    if (item.topics) {
      item.topics.forEach((t) => {
        if (t) topicCounts[t] = (topicCounts[t] || 0) + 1;
      });
    }
  });

  const sortByCount = (counts: Record<string, number>) =>
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({ value: key, count }));

  return {
    contentTypes: sortByCount(typeCounts),
    industries: sortByCount(industryCounts),
    organizations: sortByCount(orgCounts),
    topics: sortByCount(topicCounts),
  };
}

// Stats for the portfolio
export function getStats() {
  return {
    totalPieces: contentData.length,
    publications: getPublications().length,
    organizations: getOrganizations().length,
    contentTypes: getContentTypes().length,
  };
}

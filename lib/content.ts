import contentData from "@/data/content.json";
import { ContentItem } from "./types";

// Re-export types for convenience
export type { ContentItem } from "./types";
export { getIndustriesFromTopics } from "./types";

// Alias for backward compatibility
export type ContentPiece = ContentItem;

// Get all published content sorted by date
export function getPublishedContent(): ContentPiece[] {
  return [...contentData].sort((a, b) => {
    return new Date(b.published).getTime() - new Date(a.published).getTime();
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
      piece.title.toLowerCase().includes(lowerQuery) ||
      piece.publication.toLowerCase().includes(lowerQuery) ||
      piece.person.toLowerCase().includes(lowerQuery) ||
      piece.organization.toLowerCase().includes(lowerQuery) ||
      piece.topics.some((t) => t.toLowerCase().includes(lowerQuery)) ||
      piece.tags.some((t) => t.toLowerCase().includes(lowerQuery))
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
    if (filters.topic && !piece.topics.includes(filters.topic)) {
      return false;
    }
    if (filters.tag && !piece.tags.includes(filters.tag)) {
      return false;
    }
    return true;
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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

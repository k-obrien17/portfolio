// Shared types for content management

export interface ContentItem {
  id: string;
  title: string;
  url: string;
  published: string;
  contentType: string;
  publication: string;
  person: string;
  organization: string;
  industry: string[];
  topics: string[];
  tags: string[];
}

export interface ContentFilters {
  contentTypes: string[];
  publications: string[];
  organizations: string[];
  industries: string[];
  tags: string[];
}

export interface ContentCounts {
  contentTypes: Record<string, number>;
  publications: Record<string, number>;
  organizations: Record<string, number>;
  industries: Record<string, number>;
  tags: Record<string, number>;
}

export interface ActiveFilters {
  contentType: string | null;
  organization: string | null;
  publication: string | null;
  industry: string | null;
  tag: string | null;
}

// Helper to extract industries from topics
export function getIndustriesFromTopics(topics: string[]): string[] {
  const industries = new Set<string>();
  (topics || []).forEach(topic => {
    const parts = topic.split(' - ');
    if (parts.length >= 2) {
      industries.add(parts[parts.length - 1]);
    }
  });
  return [...industries];
}

// Helper to filter content based on active filters
export function filterContent(content: ContentItem[], activeFilters: ActiveFilters): ContentItem[] {
  return content.filter(item => {
    if (activeFilters.contentType && item.contentType !== activeFilters.contentType) return false;
    if (activeFilters.organization && item.organization !== activeFilters.organization) return false;
    if (activeFilters.publication && item.publication !== activeFilters.publication) return false;
    if (activeFilters.industry && !getIndustriesFromTopics(item.topics).includes(activeFilters.industry)) return false;
    if (activeFilters.tag && !item.tags?.includes(activeFilters.tag)) return false;
    return true;
  });
}

import {
  getPublishedContent,
  getContentTypes,
  getOrganizations,
  getPublications,
  getTags,
} from "@/lib/content";
import { getIndustriesFromTopics } from "@/lib/types";
import type { ContentFilters, ContentCounts } from "@/lib/types";
import StyleShowcase from "./style-showcase";

export default function StylesPage() {
  const content = getPublishedContent();
  const contentTypes = getContentTypes();
  const organizations = getOrganizations();
  const publications = getPublications();
  const tags = getTags();

  // Extract industries from topics using shared helper
  const industrySet = new Set<string>();
  content.forEach(item => {
    getIndustriesFromTopics(item.topics).forEach(ind => industrySet.add(ind));
  });
  const industries = [...industrySet].sort();

  // Single-pass count calculation for all dimensions
  const counts: ContentCounts = {
    contentTypes: {},
    organizations: {},
    publications: {},
    industries: {},
    tags: {},
  };

  // Initialize all counts to 0
  contentTypes.forEach(t => { counts.contentTypes[t] = 0; });
  organizations.forEach(o => { counts.organizations[o] = 0; });
  publications.forEach(p => { counts.publications[p] = 0; });
  industries.forEach(i => { counts.industries[i] = 0; });
  tags.forEach(t => { counts.tags[t] = 0; });

  // Single pass through content to build all counts
  content.forEach(item => {
    if (item.contentType) counts.contentTypes[item.contentType]++;
    if (item.organization) counts.organizations[item.organization]++;
    if (item.publication) counts.publications[item.publication]++;

    // Industry (dedupe per item)
    const itemIndustries = new Set(getIndustriesFromTopics(item.topics));
    itemIndustries.forEach(ind => {
      if (counts.industries[ind] !== undefined) counts.industries[ind]++;
    });

    // Tags
    (item.tags || []).forEach(tag => {
      if (counts.tags[tag] !== undefined) counts.tags[tag]++;
    });
  });

  // Sort by count descending
  const sortByCount = (items: string[], countMap: Record<string, number>) =>
    [...items].sort((a, b) => (countMap[b] || 0) - (countMap[a] || 0));

  const filters: ContentFilters = {
    contentTypes: sortByCount(contentTypes, counts.contentTypes),
    organizations: sortByCount(organizations, counts.organizations),
    publications: sortByCount(publications, counts.publications),
    industries: sortByCount(industries, counts.industries),
    tags: sortByCount(tags, counts.tags),
  };

  return (
    <StyleShowcase
      content={content}
      filters={filters}
      counts={counts}
    />
  );
}

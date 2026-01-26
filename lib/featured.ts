import contentData from "@/data/content.json";
import { ContentItem } from "./types";
import { getWorkType, WORK_TYPES, WorkType, generateSummary } from "./taxonomy";

// Curated list of featured work IDs
// These are hand-picked to show range: bylines, case studies, different clients
const FEATURED_IDS = [
  "the-future-of-digital-advertising-no-code-creation-smart-automation-an-vxae9o", // Byline - AdvertisingWeek
  "axa-uses-creative-attention-scoring-to-drive-business-outcom-swd9y9", // Case Study - AXA
  "how-ai-can-revolutionize-contract-negotiations-infinity-loop-2025-09-18-kv70i0", // Byline - AI/Contracts
  "creative-quality-the-key-to-reducing-cpm-and-sales-growth-realeyes-2025-07-22-o41dnn", // White Paper
  "women-who-will-heather-knapp-gertrude-2025-12-17-b3l33v", // Interview
];

export interface FeaturedItem extends ContentItem {
  workType: WorkType;
  workTypeLabel: string;
  summary: string;
}

// Fallback: if IDs don't match, get best content by type
function getFallbackFeatured(): FeaturedItem[] {
  const bylines = contentData
    .filter((c) => c.contentType === "Byline")
    .slice(0, 2)
    .map(enrichItem);
  const caseStudies = contentData
    .filter((c) => c.contentType === "Case Study")
    .slice(0, 1)
    .map(enrichItem);
  const whitePapers = contentData
    .filter((c) => c.contentType === "White Paper")
    .slice(0, 1)
    .map(enrichItem);
  const interviews = contentData
    .filter((c) => c.contentType === "Interview")
    .slice(0, 1)
    .map(enrichItem);

  return [...bylines, ...caseStudies, ...whitePapers, ...interviews].slice(0, 5);
}

function enrichItem(item: ContentItem): FeaturedItem {
  const workType = getWorkType(item.contentType);
  return {
    ...item,
    workType,
    workTypeLabel: WORK_TYPES[workType].label,
    summary: generateSummary(item.title, item.organization, item.contentType, item.tags),
  };
}

export function getFeaturedContent(): FeaturedItem[] {
  const featured = FEATURED_IDS.map((id) => contentData.find((c) => c.id === id))
    .filter((c): c is ContentItem => c !== undefined)
    .map(enrichItem);

  // If we couldn't find the IDs, use fallback
  if (featured.length < 3) {
    return getFallbackFeatured();
  }

  return featured;
}

// Helper to get a nice label for content type (legacy, use workTypeLabel instead)
export function getContentTypeLabel(type: string): string {
  const workType = getWorkType(type);
  return WORK_TYPES[workType].label;
}

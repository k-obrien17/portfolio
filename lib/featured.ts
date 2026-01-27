import rawContentData from "@/data/content.json";
import { ContentItem } from "./types";

// Cast imported JSON to proper type
const contentData = rawContentData as ContentItem[];

// Curated list of featured work IDs
// These are hand-picked to show range: bylines, case studies, different clients
const FEATURED_IDS = [
  "the-future-of-digital-advertising-no-code-creation-smart-automation-an-vxae9o", // Byline - AdvertisingWeek
  "axa-uses-creative-attention-scoring-to-drive-business-outcom-swd9y9", // Case Study - AXA
  "how-ai-can-revolutionize-contract-negotiations-infinity-loop-2025-09-18-kv70i0", // Byline - AI/Contracts
  "creative-quality-the-key-to-reducing-cpm-and-sales-growth-realeyes-2025-07-22-o41dnn", // White Paper
  "women-who-will-heather-knapp-gertrude-2025-12-17-b3l33v", // Interview
];

// Fallback: if IDs don't match, get best content by type
function getFallbackFeatured(): ContentItem[] {
  const bylines = contentData.filter((c) => c.contentType === "Byline").slice(0, 2);
  const caseStudies = contentData.filter((c) => c.contentType === "Case Study").slice(0, 1);
  const whitePapers = contentData.filter((c) => c.contentType === "White Paper").slice(0, 1);
  const interviews = contentData.filter((c) => c.contentType === "Interview").slice(0, 1);

  return [...bylines, ...caseStudies, ...whitePapers, ...interviews].slice(0, 5) as ContentItem[];
}

export function getFeaturedContent(): ContentItem[] {
  const featured = FEATURED_IDS.map((id) => contentData.find((c) => c.id === id))
    .filter((c): c is ContentItem => c !== undefined);

  // If we couldn't find the IDs, use fallback
  if (featured.length < 3) {
    return getFallbackFeatured();
  }

  return featured as ContentItem[];
}

// Taxonomy system for portfolio content
// Primary: Work Type (what deliverable)
// Secondary: Problem Area (what domain)

export type WorkType = "articles" | "social" | "blogs" | "research" | "case-studies" | "other";
export type ProblemArea = "marketing" | "ai-tech" | "sales-growth" | "finance" | "product" | "people" | "health" | "other";

// Work Type configuration
export const WORK_TYPES: Record<WorkType, { label: string; description: string }> = {
  "articles": {
    label: "Articles",
    description: "Bylines and sponsored content in industry publications"
  },
  "social": {
    label: "Social",
    description: "LinkedIn thought leadership posts"
  },
  "blogs": {
    label: "Blogs",
    description: "Blog posts and newsletters"
  },
  "research": {
    label: "Research",
    description: "White papers, reports, and deep-dive content"
  },
  "case-studies": {
    label: "Case Studies",
    description: "Case studies and executive interviews"
  },
  "other": {
    label: "Other",
    description: "Websites, decks, and other materials"
  },
};

// Problem Area configuration
export const PROBLEM_AREAS: Record<ProblemArea, { label: string; keywords: string[] }> = {
  "marketing": {
    label: "Marketing & Ads",
    keywords: ["Marketing", "Media Buying", "Advertising", "Brand", "Creative"]
  },
  "ai-tech": {
    label: "AI & Tech",
    keywords: ["Artificial Intelligence", "Information Technology", "Software", "Cloud", "Cybersecurity", "Digital"]
  },
  "sales-growth": {
    label: "Sales & Growth",
    keywords: ["Sales", "Business Strategy", "Growth", "Revenue", "Entrepreneurship"]
  },
  "finance": {
    label: "Finance",
    keywords: ["Finance", "Accounting", "Legal", "Insurance", "Investing"]
  },
  "product": {
    label: "Product",
    keywords: ["Product", "Engineering", "Development", "Infrastructure"]
  },
  "people": {
    label: "People & Culture",
    keywords: ["Human Resources", "Leadership", "Culture", "Employee", "DEI"]
  },
  "health": {
    label: "Health",
    keywords: ["Health", "Mental Health", "Sleep", "Wellness", "Medicine"]
  },
  "other": {
    label: "Other",
    keywords: []
  },
};

// Map legacy contentType to WorkType
const CONTENT_TYPE_MAP: Record<string, WorkType> = {
  "Byline": "articles",
  "Sponsored Content": "articles",
  "LinkedIn post": "social",
  "Blog": "blogs",
  "Newsletter": "blogs",
  "White Paper": "research",
  "Report": "research",
  "Annual Report": "research",
  "Topic Page": "research",
  "Case Study": "case-studies",
  "Interview": "case-studies",
  "Web Page/Website": "other",
  "Sales Deck": "other",
};

export function getWorkType(contentType: string): WorkType {
  return CONTENT_TYPE_MAP[contentType] || "blogs";
}

// Map topics array to ProblemArea
export function getProblemArea(topics: string[], tags: string[]): ProblemArea {
  const allText = [...topics, ...tags].join(" ").toLowerCase();

  // Check each problem area's keywords
  for (const [area, config] of Object.entries(PROBLEM_AREAS)) {
    if (area === "other") continue;
    for (const keyword of config.keywords) {
      if (allText.includes(keyword.toLowerCase())) {
        return area as ProblemArea;
      }
    }
  }

  return "other";
}

// Get display label for work type
export function getWorkTypeLabel(type: WorkType): string {
  return WORK_TYPES[type]?.label || type;
}

// Get display label for problem area
export function getProblemAreaLabel(area: ProblemArea): string {
  return PROBLEM_AREAS[area]?.label || area;
}

// Generate a summary from title and tags (fallback if no summary exists)
export function generateSummary(title: string, organization: string, contentType: string, tags: string[]): string {
  // Try to create a meaningful one-liner
  const topTag = tags[0];
  const workType = getWorkType(contentType);

  if (workType === "case-studies") {
    return topTag ? `${organization} — ${topTag}` : `Client work for ${organization}`;
  }

  if (workType === "articles") {
    return topTag ? `${topTag} insights for industry leaders` : `Industry thought leadership`;
  }

  if (workType === "research") {
    return topTag ? `Deep-dive on ${topTag}` : `Research and analysis`;
  }

  // Default: use first tag if available
  return topTag || organization;
}

// Get ordered list of work types for display
export function getWorkTypeOrder(): WorkType[] {
  return ["articles", "case-studies", "research", "blogs", "social", "other"];
}

// Get ordered list of problem areas for display
export function getProblemAreaOrder(): ProblemArea[] {
  return ["marketing", "ai-tech", "sales-growth", "finance", "product", "people", "health", "other"];
}

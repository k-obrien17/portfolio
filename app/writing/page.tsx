import { Metadata } from "next";
import { Suspense } from "react";
import { getPublishedContent, getOrganizations, getContentFilterOptions } from "@/lib/content";
import WorkBrowser from "./work-browser";
import PageCTA from "@/components/page-cta";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Published articles, bylines, case studies, and thought leadership content by Keith O'Brien",
};

interface WritingPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function WritingPage({ searchParams }: WritingPageProps) {
  const params = await searchParams;
  const { type, industry, client, topic, q } = params;

  const allContent = getPublishedContent();
  const totalOrgs = getOrganizations().length;
  const filterOptions = getContentFilterOptions();

  // Server-side filtering
  let filtered = allContent;

  if (type) {
    filtered = filtered.filter((item) => item.contentType === type);
  }
  if (industry) {
    filtered = filtered.filter((item) => item.industry?.includes(industry));
  }
  if (client) {
    filtered = filtered.filter((item) => item.organization === client);
  }
  if (topic) {
    filtered = filtered.filter((item) => item.topics?.includes(topic));
  }
  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title?.toLowerCase().includes(lower) ||
        item.organization?.toLowerCase().includes(lower) ||
        item.topics?.some((t) => t.toLowerCase().includes(lower)) ||
        item.industry?.some((i) => i.toLowerCase().includes(lower)) ||
        item.tags?.some((t) => t.toLowerCase().includes(lower)) ||
        item.person?.toLowerCase().includes(lower) ||
        item.publication?.toLowerCase().includes(lower)
    );
  }

  const PAGE_SIZE = 24;
  const page = parseInt(params.page || "1", 10);
  const paged = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > paged.length;

  const activeFilters = { type, industry, client, topic, q };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Work</h1>
        <p className="text-gray-500">
          {allContent.length} pieces across {totalOrgs} clients
        </p>
      </div>

      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <WorkBrowser
          items={paged}
          totalCount={filtered.length}
          hasMore={hasMore}
          filterOptions={filterOptions}
          activeFilters={activeFilters}
        />
      </Suspense>

      <PageCTA />
    </div>
  );
}

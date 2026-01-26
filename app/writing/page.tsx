import { Metadata } from "next";
import { getPublishedContent, getOrganizations } from "@/lib/content";
import WorkBrowser from "./work-browser";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Published articles, bylines, case studies, and thought leadership content by Keith O'Brien",
};

// Get top clients by content count
function getTopClients(minCount: number = 10): string[] {
  const content = getPublishedContent();
  const counts: Record<string, number> = {};

  content.forEach((item) => {
    counts[item.organization] = (counts[item.organization] || 0) + 1;
  });

  return Object.entries(counts)
    .filter(([, count]) => count >= minCount)
    .sort((a, b) => b[1] - a[1])
    .map(([org]) => org);
}

export default function WritingPage() {
  const content = getPublishedContent();
  const topClients = getTopClients(10);
  const totalOrgs = getOrganizations().length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Work</h1>
        <p className="text-gray-500">
          {content.length} pieces across {totalOrgs} clients
        </p>
      </div>

      <WorkBrowser initialContent={content} topClients={topClients} />
    </div>
  );
}

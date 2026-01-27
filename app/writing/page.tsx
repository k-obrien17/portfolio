import { Metadata } from "next";
import { getPublishedContent, getOrganizations } from "@/lib/content";
import WorkBrowser from "./work-browser";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Published articles, bylines, case studies, and thought leadership content by Keith O'Brien",
};

export default function WritingPage() {
  const content = getPublishedContent();
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

      <WorkBrowser initialContent={content} />
    </div>
  );
}

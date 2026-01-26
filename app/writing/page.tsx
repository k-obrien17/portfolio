import { Metadata } from "next";
import {
  getPublishedContent,
  getContentTypes,
  getPublications,
  getOrganizations,
  getTags,
} from "@/lib/content";
import SearchableWriting from "./searchable-writing";

export const metadata: Metadata = {
  title: "Work",
  description: "Published articles, bylines, and thought leadership content by Keith O'Brien",
};

export default function WritingPage() {
  const content = getPublishedContent();
  const contentTypes = getContentTypes();
  const publications = getPublications();
  const organizations = getOrganizations();
  const tags = getTags();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">Work</h1>
        <p className="text-gray-600">
          {content.length} published pieces across {organizations.length} clients
        </p>
      </div>

      <SearchableWriting
        initialContent={content}
        contentTypes={contentTypes}
        publications={publications}
        organizations={organizations}
        tags={tags}
      />
    </div>
  );
}

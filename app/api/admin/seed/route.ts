import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { bulkInsertContent, initializeDatabase } from "@/lib/db";
import contentData from "@/data/content.json";

// POST seed database from JSON file
export async function POST() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Initialize schema first
    await initializeDatabase();

    // Transform data - bulkInsertContent now expects ContentItem with camelCase
    const items = contentData.map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      // Handle empty or invalid dates
      published: item.published && item.published.match(/^\d{4}-\d{2}-\d{2}/)
        ? item.published.split('T')[0]
        : "",
      contentType: item.contentType,
      publication: item.publication,
      person: item.person,
      organization: item.organization,
      industry: (item as { industry?: string[] }).industry || [],
      topics: item.topics || [],
      tags: item.tags || [],
    }));

    const result = await bulkInsertContent(items);

    return NextResponse.json({
      success: true,
      message: `Seeded ${result.inserted} content items`,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}

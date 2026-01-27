import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getAllContent,
  createContent,
  searchContent,
  getFilterOptions,
} from "@/lib/db";

// GET all content or search
export async function GET(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  try {
    if (query) {
      const results = await searchContent(query);
      return NextResponse.json(results);
    }

    const content = await getAllContent();
    const filters = await getFilterOptions();

    return NextResponse.json({ content, filters });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

// POST create new content
export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Generate ID from title if not provided
    if (!body.id) {
      body.id = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 50) + "-" + Date.now().toString(36);
    }

    const content = await createContent({
      id: body.id,
      title: body.title,
      url: body.url,
      published: body.published || "",
      contentType: body.contentType,
      publication: body.publication || "",
      person: body.person || "",
      organization: body.organization || "",
      industry: body.industry || [],
      topics: body.topics || [],
      tags: body.tags || [],
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error("Error creating content:", error);
    return NextResponse.json(
      { error: "Failed to create content" },
      { status: 500 }
    );
  }
}

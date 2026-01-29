import { neon } from "@neondatabase/serverless";
import type { ContentItem } from "./types";

// Get database connection
export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return neon(databaseUrl);
}

// Database row type (snake_case to match PostgreSQL convention)
interface DbContentRow {
  id: string;
  title: string;
  url: string;
  published: string | null;
  content_type: string;
  publication: string;
  person: string;
  organization: string;
  industry: string[];
  topics: string[];
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

// Map database row to ContentItem (snake_case -> camelCase)
function rowToContentItem(row: DbContentRow): ContentItem {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    published: row.published || "",
    contentType: row.content_type,
    publication: row.publication,
    person: row.person,
    organization: row.organization,
    industry: row.industry || [],
    topics: row.topics || [],
    tags: row.tags || [],
  };
}

// Initialize database schema
export async function initializeDatabase() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS content (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      published DATE,
      content_type TEXT,
      publication TEXT,
      person TEXT,
      organization TEXT,
      industry TEXT[] DEFAULT '{}',
      topics TEXT[] DEFAULT '{}',
      tags TEXT[] DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create index for common queries
  await sql`CREATE INDEX IF NOT EXISTS idx_content_organization ON content(organization)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_content_published ON content(published DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_content_type ON content(content_type)`;

  return { success: true };
}

// Get all content
export async function getAllContent(): Promise<ContentItem[]> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM content
    ORDER BY published DESC NULLS LAST
  `;
  return (rows as DbContentRow[]).map(rowToContentItem);
}

// Get content by ID
export async function getContentById(id: string): Promise<ContentItem | null> {
  const sql = getDb();
  const rows = await sql`
    SELECT * FROM content WHERE id = ${id}
  `;
  if (rows.length === 0) return null;
  return rowToContentItem(rows[0] as DbContentRow);
}

// Create content
export async function createContent(content: ContentItem): Promise<ContentItem> {
  const sql = getDb();
  const rows = await sql`
    INSERT INTO content (id, title, url, published, content_type, publication, person, organization, industry, topics, tags)
    VALUES (
      ${content.id},
      ${content.title},
      ${content.url},
      ${content.published || null},
      ${content.contentType},
      ${content.publication},
      ${content.person},
      ${content.organization},
      ${content.industry},
      ${content.topics},
      ${content.tags}
    )
    RETURNING *
  `;
  return rowToContentItem(rows[0] as DbContentRow);
}

// Update content
export async function updateContent(id: string, content: Partial<ContentItem>): Promise<ContentItem | null> {
  const sql = getDb();
  // For published: distinguish "not provided" (keep existing) from "explicitly cleared" (set null)
  const publishedValue = content.published === undefined
    ? null  // CASE branch won't use this; null is safe for parameter binding
    : (content.published || null);
  const rows = await sql`
    UPDATE content SET
      title = COALESCE(${content.title}, title),
      url = COALESCE(${content.url}, url),
      published = CASE
        WHEN ${content.published === undefined} THEN published
        ELSE ${publishedValue}::date
      END,
      content_type = COALESCE(${content.contentType}, content_type),
      publication = COALESCE(${content.publication}, publication),
      person = COALESCE(${content.person}, person),
      organization = COALESCE(${content.organization}, organization),
      industry = COALESCE(${content.industry}, industry),
      topics = COALESCE(${content.topics}, topics),
      tags = COALESCE(${content.tags}, tags),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  if (rows.length === 0) return null;
  return rowToContentItem(rows[0] as DbContentRow);
}

// Delete content
export async function deleteContent(id: string): Promise<boolean> {
  const sql = getDb();
  const result = await sql`
    DELETE FROM content WHERE id = ${id}
    RETURNING id
  `;
  return result.length > 0;
}

// Search content
export async function searchContent(query: string): Promise<ContentItem[]> {
  const sql = getDb();
  const escapedQuery = query.replace(/[%_\\]/g, "\\$&");
  const searchTerm = `%${escapedQuery}%`;
  const rows = await sql`
    SELECT * FROM content
    WHERE
      title ILIKE ${searchTerm} OR
      person ILIKE ${searchTerm} OR
      organization ILIKE ${searchTerm} OR
      publication ILIKE ${searchTerm} OR
      ${query} = ANY(tags) OR
      ${query} = ANY(topics)
    ORDER BY published DESC NULLS LAST
  `;
  return (rows as DbContentRow[]).map(rowToContentItem);
}

// Get unique values for filters
export async function getFilterOptions() {
  const sql = getDb();

  const [types, publications, organizations, tags] = await Promise.all([
    sql`SELECT DISTINCT content_type FROM content WHERE content_type IS NOT NULL ORDER BY content_type`,
    sql`SELECT DISTINCT publication FROM content WHERE publication IS NOT NULL AND publication != '' ORDER BY publication`,
    sql`SELECT DISTINCT organization FROM content WHERE organization IS NOT NULL ORDER BY organization`,
    sql`SELECT DISTINCT unnest(tags) as tag FROM content ORDER BY tag`,
  ]);

  return {
    contentTypes: types.map((r) => r.content_type as string),
    publications: publications.map((r) => r.publication as string),
    organizations: organizations.map((r) => r.organization as string),
    tags: tags.map((r) => r.tag as string),
  };
}

// Bulk insert (for seeding from JSON)
// Uses upsert + cleanup instead of truncate-first to avoid data loss on partial failure
export async function bulkInsertContent(items: ContentItem[]) {
  const sql = getDb();
  const insertedIds: string[] = [];

  // Upsert all items (safe: existing data preserved if insert fails mid-way)
  for (const item of items) {
    const publishedDate = item.published && item.published !== '' ? item.published : null;

    await sql`
      INSERT INTO content (id, title, url, published, content_type, publication, person, organization, industry, topics, tags)
      VALUES (
        ${item.id},
        ${item.title},
        ${item.url},
        ${publishedDate}::date,
        ${item.contentType || ''},
        ${item.publication || ''},
        ${item.person || ''},
        ${item.organization || ''},
        ${item.industry || []},
        ${item.topics || []},
        ${item.tags || []}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        url = EXCLUDED.url,
        published = EXCLUDED.published,
        content_type = EXCLUDED.content_type,
        publication = EXCLUDED.publication,
        person = EXCLUDED.person,
        organization = EXCLUDED.organization,
        industry = EXCLUDED.industry,
        topics = EXCLUDED.topics,
        tags = EXCLUDED.tags,
        updated_at = CURRENT_TIMESTAMP
    `;
    insertedIds.push(item.id);
  }

  // Only remove stale rows after all inserts succeed
  await sql`DELETE FROM content WHERE id != ALL(${insertedIds})`;

  return { inserted: items.length };
}

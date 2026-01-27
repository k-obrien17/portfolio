import * as fs from "fs";
import * as path from "path";

const VAULT_PATH = "/Users/keithobrien/Desktop/obsidian-workspace/vault";
const ORGANIZATIONS_PATH = path.join(VAULT_PATH, "020-Organizations");
const OUTPUT_PATH = "/Users/keithobrien/Desktop/Claude/Projects/portfolio/data/content.json";

interface ContentItem {
  id: string;
  title: string;
  url: string;
  published: string;
  contentType: string;
  publication: string;
  person: string;
  organization: string;
  industry: string[];
  topics: string[];
  tags: string[];
}

interface ParsedYaml {
  [key: string]: string | string[] | boolean;
}

function parseYamlFrontmatter(content: string): ParsedYaml {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};

  const yaml: ParsedYaml = {};
  const lines = frontmatterMatch[1].split("\n");

  let currentKey = "";
  let inArray = false;

  for (const line of lines) {
    // Check for array item
    if (line.match(/^\s+-\s+/)) {
      if (currentKey && inArray) {
        let value = line.replace(/^\s+-\s+/, "").trim();
        // Remove quotes
        value = value.replace(/^["']|["']$/g, "");
        if (!Array.isArray(yaml[currentKey])) {
          yaml[currentKey] = [];
        }
        (yaml[currentKey] as string[]).push(value);
      }
      continue;
    }

    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();

    currentKey = key;

    // Check if this starts an array (empty value or just whitespace)
    if (value === "" || value === "[]") {
      inArray = true;
      yaml[key] = [];
      continue;
    }

    inArray = false;

    // Handle inline array [item1, item2]
    if (value.startsWith("[") && value.endsWith("]")) {
      const items = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      yaml[key] = items;
      continue;
    }

    // Handle boolean
    if (value === "true") {
      yaml[key] = true;
      continue;
    }
    if (value === "false") {
      yaml[key] = false;
      continue;
    }

    // Remove quotes from string values
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    yaml[key] = value;
  }

  return yaml;
}

function cleanWikilink(value: string | string[] | boolean | undefined): string {
  if (!value || typeof value === "boolean") return "";
  if (Array.isArray(value)) {
    value = value[0] || "";
  }
  // Convert [[Name]] or [[Name|Alias]] to just Name
  const match = value.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/);
  return match ? match[1] : value;
}

function generateId(title: string, organization: string, published: string, filePath: string): string {
  // Include a hash from filepath to ensure uniqueness
  const hash = filePath.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0).toString(36).replace('-', '');

  const base = `${title}-${organization}-${published}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 70);
  return `${base}-${hash}`;
}

function findContentFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        // Skip hidden directories and .obsidian
        if (!entry.name.startsWith(".")) {
          walk(fullPath);
        }
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        // Only include files in Content folders
        if (currentDir.includes("/Content")) {
          files.push(fullPath);
        }
      }
    }
  }

  walk(dir);
  return files;
}

function itemsEqual(a: ContentItem, b: ContentItem): boolean {
  return (
    a.title === b.title &&
    a.published === b.published &&
    a.contentType === b.contentType &&
    a.publication === b.publication &&
    a.person === b.person &&
    a.organization === b.organization &&
    JSON.stringify(a.industry) === JSON.stringify(b.industry) &&
    JSON.stringify(a.topics) === JSON.stringify(b.topics) &&
    JSON.stringify(a.tags) === JSON.stringify(b.tags)
  );
}

async function main() {
  // Check for flags
  const fullReplace = process.argv.includes("--full");
  const updateMode = process.argv.includes("--update");

  if (fullReplace) {
    console.log("FULL SYNC: Replacing all content...");
  } else if (updateMode) {
    console.log("UPDATE SYNC: Adding new + updating changed items...");
  } else {
    console.log("INCREMENTAL SYNC: Adding new items only...");
  }
  console.log(`Source: ${ORGANIZATIONS_PATH}`);
  console.log(`Output: ${OUTPUT_PATH}\n`);

  // Load existing content
  let existingItems: ContentItem[] = [];
  const existingByUrl = new Map<string, ContentItem>();

  if (!fullReplace && fs.existsSync(OUTPUT_PATH)) {
    try {
      existingItems = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
      existingItems.forEach(item => existingByUrl.set(item.url, item));
      console.log(`Loaded ${existingItems.length} existing items`);
    } catch (e) {
      console.log("Could not load existing content, starting fresh");
    }
  }

  const allFiles = findContentFiles(ORGANIZATIONS_PATH);
  console.log(`Found ${allFiles.length} content files in Obsidian`);

  const newItems: ContentItem[] = [];
  const updatedItems: ContentItem[] = [];
  const obsidianUrls = new Set<string>();
  let skippedNoPortfolio = 0;
  let skippedNoUrl = 0;
  let skippedUnchanged = 0;

  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, "utf-8");
    const yaml = parseYamlFrontmatter(content);

    // Only include files with portfolio: true
    if (yaml.portfolio !== true) {
      skippedNoPortfolio++;
      continue;
    }

    // Skip items without URL
    if (!yaml.url) {
      skippedNoUrl++;
      continue;
    }

    const url = yaml.url as string;
    obsidianUrls.add(url);

    // Extract title from filename if not in frontmatter
    const fileName = path.basename(filePath, ".md");
    const title = (yaml.title as string) || fileName.split(" - ")[0];

    const org = cleanWikilink((yaml.organization as string) || "");
    // Clean date - extract just YYYY-MM-DD, removing any trailing corruption like "s:"
    const rawPublished = (yaml.published as string) || (yaml.datePublished as string) || "";
    const dateMatch = rawPublished.match(/^(\d{4}-\d{2}-\d{2})/);
    const published = dateMatch ? dateMatch[1] : "";

    const item: ContentItem = {
      id: generateId(title, org, published, filePath),
      title: title,
      url: url,
      published: published,
      contentType: (yaml.content_type as string) || (yaml.contentType as string) || "",
      publication: (yaml.publication as string) || "",
      person: cleanWikilink((yaml.person as string) || ""),
      organization: org,
      industry: Array.isArray(yaml.industry) ? yaml.industry : yaml.industry ? [yaml.industry as string] : [],
      topics: Array.isArray(yaml.topics) ? yaml.topics : yaml.topics ? [yaml.topics as string] : [],
      tags: Array.isArray(yaml.tags) ? yaml.tags : yaml.tags ? [yaml.tags as string] : [],
    };

    const existing = existingByUrl.get(url);

    if (!existing) {
      // New item
      newItems.push(item);
    } else if (updateMode && !itemsEqual(item, existing)) {
      // Changed item - preserve the original ID
      item.id = existing.id;
      updatedItems.push(item);
    } else {
      skippedUnchanged++;
    }
  }

  // Build final list
  let finalItems: ContentItem[];

  if (fullReplace) {
    finalItems = newItems;
  } else {
    // Start with existing items
    finalItems = existingItems.map(item => {
      // Replace with updated version if exists
      const updated = updatedItems.find(u => u.url === item.url);
      return updated || item;
    });
    // Add new items
    finalItems.push(...newItems);
  }

  // Sort by date (newest first)
  finalItems.sort((a, b) => {
    if (!a.published && !b.published) return 0;
    if (!a.published) return 1;
    if (!b.published) return -1;
    return new Date(b.published).getTime() - new Date(a.published).getTime();
  });

  // Write JSON
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(finalItems, null, 2));

  if (fullReplace) {
    console.log(`\n✓ Full sync: ${finalItems.length} items`);
  } else {
    console.log(`\n✓ Sync complete`);
    console.log(`  Added: ${newItems.length} new items`);
    if (updateMode) {
      console.log(`  Updated: ${updatedItems.length} changed items`);
    }
    console.log(`  Unchanged: ${skippedUnchanged}`);
    console.log(`  Total: ${finalItems.length} items`);
  }
  console.log(`  Skipped ${skippedNoPortfolio} (no portfolio: true)`);
  console.log(`  Skipped ${skippedNoUrl} (no URL)`);

  // Stats by content type
  const byType = finalItems.reduce(
    (acc, item) => {
      const type = item.contentType || "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  console.log("\nBy content type:");
  Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

  // Stats by organization
  const byOrg = finalItems.reduce(
    (acc, item) => {
      const org = item.organization || "Unknown";
      acc[org] = (acc[org] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  console.log("\nTop organizations:");
  Object.entries(byOrg)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([org, count]) => {
      console.log(`  ${org}: ${count}`);
    });
}

main();

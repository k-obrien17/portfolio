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

async function main() {
  console.log("Syncing Obsidian vault to portfolio JSON...");
  console.log(`Source: ${ORGANIZATIONS_PATH}`);
  console.log(`Output: ${OUTPUT_PATH}\n`);

  const allFiles = findContentFiles(ORGANIZATIONS_PATH);
  console.log(`Found ${allFiles.length} content files`);

  const items: ContentItem[] = [];
  let skippedNoPortfolio = 0;
  let skippedNoUrl = 0;

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

    // Extract title from filename if not in frontmatter
    const fileName = path.basename(filePath, ".md");
    const title = (yaml.title as string) || fileName.split(" - ")[0];

    const org = cleanWikilink((yaml.organization as string) || "");
    const published = (yaml.published as string) || (yaml.datePublished as string) || "";

    const item: ContentItem = {
      id: generateId(title, org, published, filePath),
      title: title,
      url: yaml.url as string,
      published: published,
      contentType: (yaml.content_type as string) || (yaml.contentType as string) || "",
      publication: (yaml.publication as string) || "",
      person: cleanWikilink((yaml.person as string) || ""),
      organization: org,
      topics: Array.isArray(yaml.topics) ? yaml.topics : yaml.topics ? [yaml.topics as string] : [],
      tags: Array.isArray(yaml.tags) ? yaml.tags : yaml.tags ? [yaml.tags as string] : [],
    };

    items.push(item);
  }

  // Sort by date (newest first)
  items.sort((a, b) => {
    if (!a.published && !b.published) return 0;
    if (!a.published) return 1;
    if (!b.published) return -1;
    return new Date(b.published).getTime() - new Date(a.published).getTime();
  });

  // Write JSON
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(items, null, 2));

  console.log(`\n✓ Synced ${items.length} items to portfolio`);
  console.log(`  Skipped ${skippedNoPortfolio} (no portfolio: true)`);
  console.log(`  Skipped ${skippedNoUrl} (no URL)`);

  // Stats by content type
  const byType = items.reduce(
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
  const byOrg = items.reduce(
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

import * as fs from "fs";
import * as path from "path";

interface ContentItem {
  title: string;
  organization: string;
  contentType: string;
  url: string;
  publication: string;
  datePublished: string;
  // Person fields (enhanced)
  person: string;
  personTitle: string;
  personLinkedIn: string;
  personOrg: string;
  // Array fields (enhanced)
  topics: string[];
  tags: string[];
  industry: string[];
  assets: string[];
  // Other
  category: string;
}

const EXPORT_BASE = "/Users/keithobrien/Documents/Tana-Export/1-24-26/Main Workspace/Main Workspace";
const CONTENT_FOLDER = path.join(EXPORT_BASE, "my content");
const VAULT_PATH = "/Users/keithobrien/Projects/portfolio/content-vault";

function extractLinkText(text: string): string {
  const match = text.match(/\[([^\]]+)\]/);
  return match ? match[1] : text.trim();
}

function extractUrl(text: string): string {
  const match = text.match(/\(([^)]+)\)/);
  return match ? match[1] : "";
}

function parseDetailFile(filePath: string): ContentItem {
  const item: ContentItem = {
    title: "",
    organization: "",
    contentType: "",
    url: "",
    publication: "",
    datePublished: "",
    person: "",
    personTitle: "",
    personLinkedIn: "",
    personOrg: "",
    topics: [],
    tags: [],
    industry: [],
    assets: [],
    category: "",
  };

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");

    // First line is the title
    if (lines[0]) {
      const titleLine = lines[0].replace(/#my-content/g, "").trim();
      const parts = titleLine.split(" - ");
      if (parts.length >= 3) {
        item.contentType = parts[parts.length - 1].trim();
        item.organization = parts[parts.length - 2].trim();
        item.title = parts.slice(0, -2).join(" - ").trim();
      } else if (parts.length === 2) {
        item.title = parts[0].trim();
        item.organization = parts[1].trim();
      } else {
        item.title = titleLine;
      }
    }

    // Parse field lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Organization
      if (line.startsWith("- **Organization(s)**:")) {
        item.organization = extractLinkText(line.split("**:")[1] || "");
      }

      // URL
      if (line.startsWith("- **URL**:")) {
        const urlMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (urlMatch) {
          item.url = urlMatch[1]; // The URL is in the link text for Tana exports
        }
      }

      // Publication
      if (line.startsWith("- **Publication**:")) {
        const linkMatch = line.match(/\[([^\]]+)\]/);
        if (linkMatch) {
          item.publication = linkMatch[1];
        } else {
          const match = line.match(/:\s*(.+?)(?:\s*#|$)/);
          if (match) {
            item.publication = match[1].trim();
          }
        }
      }

      // Content Type
      if (line.startsWith("- **Content Type**:")) {
        const match = line.match(/:\s*(.+?)$/);
        if (match) {
          item.contentType = match[1].trim();
        }
      }

      // Date Published
      if (line.startsWith("- **Date Published**:")) {
        const match = line.match(/:\s*\*(\d{4}-\d{2}-\d{2})\*/);
        if (match) {
          item.datePublished = match[1].trim();
        }
      }

      // Person - enhanced to capture sub-fields
      if (line.startsWith("- **Person**:")) {
        const linkMatch = line.match(/\[([^\]]+)\]/);
        if (linkMatch) {
          item.person = linkMatch[1];
        } else {
          const match = line.match(/:\s*(.+?)(?:\s*#|$)/);
          if (match && match[1].trim()) {
            item.person = match[1].trim();
          }
        }

        // Look for nested Person sub-fields
        let j = i + 1;
        while (j < lines.length && lines[j].match(/^\s+- \*\*/)) {
          const subLine = lines[j];

          // Job Title
          if (subLine.includes("**Job Title**:")) {
            const titleMatch = subLine.match(/:\s*(.+?)(?:\s*#|$)/);
            if (titleMatch) {
              item.personTitle = titleMatch[1].trim();
            }
          }

          // LinkedIn
          if (subLine.includes("**LinkedIn**:")) {
            const linkedInMatch = subLine.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (linkedInMatch) {
              item.personLinkedIn = linkedInMatch[2];
            } else {
              const urlMatch = subLine.match(/https?:\/\/[^\s\)]+/);
              if (urlMatch) {
                item.personLinkedIn = urlMatch[0];
              }
            }
          }

          // Current Organization
          if (subLine.includes("**Current Organization**:")) {
            const orgMatch = subLine.match(/\[([^\]]+)\]/);
            if (orgMatch) {
              item.personOrg = orgMatch[1];
            }
          }

          j++;
        }
      }

      // Topic(s) - capture ALL as array
      if (line.startsWith("- **Topic(s)**:")) {
        // Check for inline topic
        const inlineMatch = line.match(/\[([^\]]+)\]/);
        if (inlineMatch) {
          item.topics.push(inlineMatch[1]);
        }

        // Check for nested topics
        let j = i + 1;
        while (j < lines.length && lines[j].match(/^\s+-\s/)) {
          const topicMatch = lines[j].match(/\[([^\]]+)\]/);
          if (topicMatch) {
            item.topics.push(topicMatch[1]);
          }
          j++;
        }
      }

      // Industry - capture ALL as array
      if (line.startsWith("- **Industry**:")) {
        // Check for inline industry
        const linkMatch = line.match(/\[([^\]]+)\]/);
        if (linkMatch) {
          item.industry.push(linkMatch[1]);
        } else {
          const match = line.match(/:\s*(.+?)(?:\s*#|$)/);
          if (match && match[1].trim()) {
            item.industry.push(match[1].trim());
          }
        }

        // Check for nested industries
        let j = i + 1;
        while (j < lines.length && lines[j].match(/^\s+-\s/)) {
          const nestedMatch = lines[j].match(/\[([^\]]+)\]/);
          if (nestedMatch) {
            item.industry.push(nestedMatch[1]);
          } else {
            const plainMatch = lines[j].match(/^\s+-\s+(.+?)(?:\s*#|$)/);
            if (plainMatch) {
              item.industry.push(plainMatch[1].trim());
            }
          }
          j++;
        }
      }

      // Category Classification
      if (line.startsWith("- **Category Classification**:")) {
        const match = line.match(/\[([^\]]+)\]/);
        if (match) {
          item.category = match[1];
        }
      }

      // Asset - capture ALL as array
      if (line.startsWith("- **Asset**:")) {
        // Check for image markdown
        const imgMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (imgMatch) {
          item.assets.push(imgMatch[1] || imgMatch[2]);
        } else {
          // Plain text asset
          const match = line.match(/:\s*(.+?)$/);
          if (match && match[1].trim()) {
            item.assets.push(match[1].trim());
          }
        }

        // Check for nested assets
        let j = i + 1;
        while (j < lines.length && lines[j].match(/^\s+-\s/)) {
          const nestedImgMatch = lines[j].match(/!\[([^\]]*)\]\(([^)]+)\)/);
          if (nestedImgMatch) {
            item.assets.push(nestedImgMatch[1] || nestedImgMatch[2]);
          } else {
            const plainMatch = lines[j].match(/^\s+-\s+(.+?)(?:\s*#|$)/);
            if (plainMatch) {
              item.assets.push(plainMatch[1].trim());
            }
          }
          j++;
        }
      }

      // Content Tags - capture ALL as array
      if (line.startsWith("- **Content Tags**:")) {
        const inlineMatch = line.match(/\[([^\]]+)\]/g);
        if (inlineMatch) {
          item.tags.push(...inlineMatch.map(t => t.replace(/[\[\]]/g, "")));
        }

        // Check for nested tags
        let j = i + 1;
        while (j < lines.length && lines[j].match(/^\s+-\s/)) {
          const tagMatch = lines[j].match(/\[([^\]]+)\]/);
          if (tagMatch) {
            item.tags.push(tagMatch[1]);
          } else {
            const plainTag = lines[j].match(/^\s+-\s+(.+?)(?:\s*#|$)/);
            if (plainTag && !plainTag[1].includes("**")) {
              item.tags.push(plainTag[1].trim());
            }
          }
          j++;
        }
      }
    }
  } catch (err) {
    console.error(`Error parsing ${filePath}:`, err);
  }

  return item;
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[\/\\:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 100);
}

function sanitizeFolderName(name: string): string {
  return name
    .replace(/[\/\\:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeYaml(value: string): string {
  if (!value) return '""';
  if (value.includes(":") || value.includes("#") || value.includes('"') || value.includes("'") || value.includes("\n") || value.includes("[") || value.includes("]")) {
    return `"${value.replace(/"/g, '\\"')}"`;
  }
  return value;
}

function formatYamlArray(arr: string[]): string {
  if (arr.length === 0) return "[]";
  return "\n" + arr.map(item => `  - ${escapeYaml(item)}`).join("\n");
}

function generateObsidianFile(item: ContentItem): string {
  const frontmatter = [
    "---",
    `title: ${escapeYaml(item.title)}`,
    `organization: ${escapeYaml(item.organization)}`,
    `contentType: ${escapeYaml(item.contentType)}`,
    `url: ${escapeYaml(item.url)}`,
    `publication: ${escapeYaml(item.publication)}`,
    `datePublished: ${item.datePublished || ""}`,
    "",
    "# Person details",
    `person: ${escapeYaml(item.person)}`,
    `personTitle: ${escapeYaml(item.personTitle)}`,
    `personLinkedIn: ${escapeYaml(item.personLinkedIn)}`,
    `personOrg: ${escapeYaml(item.personOrg)}`,
    "",
    "# Arrays",
    `topics:${formatYamlArray(item.topics)}`,
    `industry:${formatYamlArray(item.industry)}`,
    `tags:${formatYamlArray(item.tags)}`,
    `assets:${formatYamlArray(item.assets)}`,
    "",
    `category: ${escapeYaml(item.category)}`,
    "---",
    "",
  ];

  const body = [
    `# ${item.title}`,
    "",
    `**Type:** ${item.contentType}`,
    item.publication ? `**Publication:** ${item.publication}` : "",
    item.person ? `**Person:** [[${item.person}]]` : "",
    item.personTitle ? `**Title:** ${item.personTitle}` : "",
    item.datePublished ? `**Published:** ${item.datePublished}` : "",
    "",
    item.url ? `[View Content](${item.url})` : "",
    "",
    item.topics.length > 0 ? `## Topics\n${item.topics.map(t => `- ${t}`).join("\n")}` : "",
    "",
    item.tags.length > 0 ? `## Tags\n${item.tags.map(t => `#${t.replace(/\s+/g, "-")}`).join(" ")}` : "",
    "",
    item.industry.length > 0 ? `## Industry\n${item.industry.map(i => `- ${i}`).join("\n")}` : "",
  ].filter(Boolean);

  return frontmatter.join("\n") + body.join("\n");
}

function generateClientIndexFile(org: string, itemCount: number): string {
  return [
    "---",
    `title: ${escapeYaml(org)}`,
    "type: client",
    "---",
    "",
    `# ${org}`,
    "",
    `**Total pieces:** ${itemCount}`,
    "",
    "## Content",
    "",
    "```dataview",
    "TABLE contentType as Type, datePublished as Published, publication as Publication",
    `FROM "${org}"`,
    "SORT datePublished DESC",
    "```",
    "",
    "## By Type",
    "",
    "```dataview",
    "TABLE length(rows) as Count",
    `FROM "${org}"`,
    "GROUP BY contentType",
    "SORT length(rows) DESC",
    "```",
  ].join("\n");
}

async function main() {
  console.log("Creating Obsidian vault with COMPLETE metadata...\n");

  // Create base folders
  fs.mkdirSync(path.join(VAULT_PATH, "People"), { recursive: true });

  // Read all content files and group by organization
  const files = fs.readdirSync(CONTENT_FOLDER).filter(f => f.endsWith(".md"));
  console.log(`Processing ${files.length} content files...`);

  const itemsByOrg = new Map<string, ContentItem[]>();
  const people = new Set<string>();

  // Stats tracking
  let totalTopics = 0;
  let totalIndustries = 0;
  let totalAssets = 0;
  let personTitles = 0;
  let personLinkedIns = 0;

  for (const file of files) {
    const filePath = path.join(CONTENT_FOLDER, file);
    const item = parseDetailFile(filePath);

    if (!item.title) continue;

    const org = item.organization || "Uncategorized";
    if (!itemsByOrg.has(org)) {
      itemsByOrg.set(org, []);
    }
    itemsByOrg.get(org)!.push(item);

    if (item.person) people.add(item.person);

    // Track stats
    totalTopics += item.topics.length;
    totalIndustries += item.industry.length;
    totalAssets += item.assets.length;
    if (item.personTitle) personTitles++;
    if (item.personLinkedIn) personLinkedIns++;
  }

  console.log(`Found ${itemsByOrg.size} organizations\n`);

  // Create folders and files for each organization
  let totalCreated = 0;
  for (const [org, items] of itemsByOrg) {
    const orgFolder = path.join(VAULT_PATH, sanitizeFolderName(org));
    fs.mkdirSync(orgFolder, { recursive: true });

    // Create index file for the organization
    const indexContent = generateClientIndexFile(org, items.length);
    fs.writeFileSync(path.join(orgFolder, "_index.md"), indexContent);

    // Create content files
    for (const item of items) {
      const content = generateObsidianFile(item);
      const filename = sanitizeFilename(item.title) + ".md";
      fs.writeFileSync(path.join(orgFolder, filename), content);
      totalCreated++;
    }
  }

  // Create people index files
  console.log(`Creating ${people.size} people files...`);
  for (const person of people) {
    const personContent = [
      "---",
      `title: ${escapeYaml(person)}`,
      "type: person",
      "---",
      "",
      `# ${person}`,
      "",
      "## Content",
      "",
      "```dataview",
      "TABLE contentType as Type, datePublished as Published, organization as Client",
      "FROM /",
      `WHERE person = "${person}"`,
      "SORT datePublished DESC",
      "```",
    ].join("\n");

    const filename = sanitizeFilename(person) + ".md";
    fs.writeFileSync(path.join(VAULT_PATH, "People", filename), personContent);
  }

  // Create main index
  const orgList = Array.from(itemsByOrg.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([org, items]) => `| [[${org}/_index\\|${org}]] | ${items.length} |`)
    .join("\n");

  const indexContent = [
    "# Portfolio Content",
    "",
    `**Total pieces:** ${totalCreated}`,
    `**Clients:** ${itemsByOrg.size}`,
    `**People:** ${people.size}`,
    "",
    "## Clients by Content Volume",
    "",
    "| Client | Pieces |",
    "|--------|--------|",
    orgList,
    "",
    "## Recent Content",
    "",
    "```dataview",
    "TABLE organization as Client, contentType as Type, publication as Publication",
    "FROM /",
    "WHERE contentType",
    "SORT datePublished DESC",
    "LIMIT 20",
    "```",
    "",
    "## By Content Type",
    "",
    "```dataview",
    "TABLE length(rows) as Count",
    "FROM /",
    "WHERE contentType",
    "GROUP BY contentType",
    "SORT length(rows) DESC",
    "```",
  ].join("\n");

  fs.writeFileSync(path.join(VAULT_PATH, "Index.md"), indexContent);

  console.log(`\n========== VAULT CREATED ==========`);
  console.log(`Location: ${VAULT_PATH}`);
  console.log(`\nContent:`);
  console.log(`  - ${totalCreated} content files`);
  console.log(`  - ${itemsByOrg.size} client folders`);
  console.log(`  - ${people.size} people files`);
  console.log(`\nEnhanced Metadata Captured:`);
  console.log(`  - ${totalTopics} total topics (avg ${(totalTopics/totalCreated).toFixed(1)} per piece)`);
  console.log(`  - ${totalIndustries} total industries (avg ${(totalIndustries/totalCreated).toFixed(1)} per piece)`);
  console.log(`  - ${totalAssets} total assets (avg ${(totalAssets/totalCreated).toFixed(1)} per piece)`);
  console.log(`  - ${personTitles} person titles captured`);
  console.log(`  - ${personLinkedIns} person LinkedIn URLs captured`);
  console.log(`\nOpen in Obsidian: File > Open Vault > ${VAULT_PATH}`);
}

main();

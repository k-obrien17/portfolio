import * as fs from "fs";
import * as path from "path";

interface ContentItem {
  title: string;
  organization: string;
  contentType: string;
  url: string;
  publication: string;
  person: string;
  datePublished: string;
  topics: string;
  contentTags: string;
  industry: string;
  categoryClassification: string;
  asset: string;
  sourceFile: string;
}

const EXPORT_BASE = "/Users/keithobrien/Documents/Tana-Export/1-24-26/Main Workspace/Main Workspace";
const CONTENT_FOLDER = path.join(EXPORT_BASE, "my content");

function extractLinkText(text: string): string {
  // Extract text from markdown link [text](<path>) or [text](path)
  const match = text.match(/\[([^\]]+)\]/);
  return match ? match[1] : text;
}

function parseDetailFile(filePath: string): ContentItem {
  const item: ContentItem = {
    title: "",
    organization: "",
    contentType: "",
    url: "",
    publication: "",
    person: "",
    datePublished: "",
    topics: "",
    contentTags: "",
    industry: "",
    categoryClassification: "",
    asset: "",
    sourceFile: path.basename(filePath),
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
          item.url = urlMatch[1]; // The URL is the link text in this case
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
        // Date is in format: *2022-03-02* - match the date after the colon
        const match = line.match(/:\s*\*(\d{4}-\d{2}-\d{2})\*/);
        if (match) {
          item.datePublished = match[1].trim();
        }
      }

      // Person
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
      }

      // Topic(s)
      if (line.startsWith("- **Topic(s)**:")) {
        const match = line.match(/\[([^\]]+)\]/);
        if (match) {
          item.topics = match[1];
        }
      }

      // Industry - can be multi-line
      if (line.startsWith("- **Industry**:")) {
        const industries: string[] = [];
        const linkMatch = line.match(/\[([^\]]+)\]/);
        if (linkMatch) {
          industries.push(linkMatch[1]);
        } else {
          const match = line.match(/:\s*(.+?)(?:\s*#|$)/);
          if (match && match[1].trim()) {
            industries.push(match[1].trim());
          }
        }
        // Check for nested industries
        let j = i + 1;
        while (j < lines.length && lines[j].match(/^\s+-\s/)) {
          const nestedMatch = lines[j].match(/\[([^\]]+)\]/);
          if (nestedMatch) {
            industries.push(nestedMatch[1]);
          }
          j++;
        }
        if (industries.length > 0) {
          item.industry = industries.join("; ");
        }
      }

      // Category Classification
      if (line.startsWith("- **Category Classification**:")) {
        const match = line.match(/\[([^\]]+)\]/);
        if (match) {
          item.categoryClassification = match[1];
        }
      }

      // Asset
      if (line.startsWith("- **Asset**:")) {
        const imgMatch = line.match(/!\[([^\]]*)\]/);
        if (imgMatch && imgMatch[1]) {
          item.asset = imgMatch[1];
        } else {
          const match = line.match(/:\s*(.+?)$/);
          if (match) {
            item.asset = match[1].trim();
          }
        }
      }

      // Content Tags - handle multi-line
      if (line.startsWith("- **Content Tags**:")) {
        const tags: string[] = [];
        const inlineMatch = line.match(/\[([^\]]+)\]/g);
        if (inlineMatch) {
          tags.push(...inlineMatch.map(t => t.replace(/[\[\]]/g, "")));
        }
        // Check for nested tags
        let j = i + 1;
        while (j < lines.length && lines[j].match(/^\s+-\s/)) {
          const tagMatch = lines[j].match(/\[([^\]]+)\]/);
          if (tagMatch) {
            tags.push(tagMatch[1]);
          } else {
            const plainTag = lines[j].match(/^\s+-\s+(.+?)(?:\s*#|$)/);
            if (plainTag) {
              tags.push(plainTag[1].trim());
            }
          }
          j++;
        }
        if (tags.length > 0) {
          item.contentTags = tags.join("; ");
        }
      }
    }
  } catch (err) {
    console.error(`Error parsing ${filePath}:`, err);
  }

  return item;
}

function escapeCSV(value: string | undefined): string {
  if (!value) return "";
  const escaped = value.replace(/"/g, '""');
  if (escaped.includes(",") || escaped.includes('"') || escaped.includes("\n") || escaped.includes("\r")) {
    return `"${escaped}"`;
  }
  return escaped;
}

async function main() {
  console.log(`Reading content files from: ${CONTENT_FOLDER}`);

  const files = fs.readdirSync(CONTENT_FOLDER).filter(f => f.endsWith(".md"));
  console.log(`Found ${files.length} content files`);

  const items: ContentItem[] = [];

  for (const file of files) {
    const filePath = path.join(CONTENT_FOLDER, file);
    const item = parseDetailFile(filePath);
    items.push(item);
  }

  console.log(`Parsed ${items.length} items`);

  // Generate CSV
  const headers = [
    "Title",
    "Organization",
    "Content Type",
    "URL",
    "Publication",
    "Person",
    "Date Published",
    "Topics",
    "Content Tags",
    "Industry",
    "Category Classification",
    "Asset",
    "Source File"
  ];

  const csvLines = [headers.join(",")];

  for (const item of items) {
    const row = [
      escapeCSV(item.title),
      escapeCSV(item.organization),
      escapeCSV(item.contentType),
      escapeCSV(item.url),
      escapeCSV(item.publication),
      escapeCSV(item.person),
      escapeCSV(item.datePublished),
      escapeCSV(item.topics),
      escapeCSV(item.contentTags),
      escapeCSV(item.industry),
      escapeCSV(item.categoryClassification),
      escapeCSV(item.asset),
      escapeCSV(item.sourceFile)
    ];
    csvLines.push(row.join(","));
  }

  const outputPath = "/Users/keithobrien/Projects/portfolio/data/portfolio-content.csv";
  fs.writeFileSync(outputPath, csvLines.join("\n"));
  console.log(`\nCSV written to: ${outputPath}`);
  console.log(`Total rows: ${items.length}`);

  // Print stats
  const withUrl = items.filter(i => i.url).length;
  const withDate = items.filter(i => i.datePublished).length;
  const withPerson = items.filter(i => i.person).length;
  const withPublication = items.filter(i => i.publication).length;
  const withTopics = items.filter(i => i.topics).length;
  const withTags = items.filter(i => i.contentTags).length;
  const withIndustry = items.filter(i => i.industry).length;

  console.log(`\nData completeness:`);
  console.log(`  - With URL: ${withUrl} (${Math.round(withUrl/items.length*100)}%)`);
  console.log(`  - With Date Published: ${withDate} (${Math.round(withDate/items.length*100)}%)`);
  console.log(`  - With Person: ${withPerson} (${Math.round(withPerson/items.length*100)}%)`);
  console.log(`  - With Publication: ${withPublication} (${Math.round(withPublication/items.length*100)}%)`);
  console.log(`  - With Topics: ${withTopics} (${Math.round(withTopics/items.length*100)}%)`);
  console.log(`  - With Content Tags: ${withTags} (${Math.round(withTags/items.length*100)}%)`);
  console.log(`  - With Industry: ${withIndustry} (${Math.round(withIndustry/items.length*100)}%)`);

  // Count unique values
  const orgs = new Set(items.map(i => i.organization).filter(Boolean));
  const types = new Set(items.map(i => i.contentType).filter(Boolean));
  const pubs = new Set(items.map(i => i.publication).filter(Boolean));

  console.log(`\nUnique organizations: ${orgs.size}`);
  console.log(`Unique content types: ${types.size}`);
  console.log(`Unique publications: ${pubs.size}`);
  console.log(`\nContent types: ${Array.from(types).join(", ")}`);
}

main();

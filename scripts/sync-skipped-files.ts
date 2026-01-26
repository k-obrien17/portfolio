import * as fs from 'fs';
import * as path from 'path';

const TANA_EXPORT_DIR = '/Users/keithobrien/Documents/Tana-Export/1-24-26/Main Workspace/Main Workspace/my content';
const VAULT_BASE = '/Users/keithobrien/PersonalOps/vault/020-Organizations';

// Organizations that were skipped previously
const SKIPPED_ORGS = [
  'coffee corral',
  'inmobi',
  'hidden sands brewing co',
  'gertrude',
  'heavy reel brewing co',
  'imm',
  'total emphasis',
];

interface TanaMetadata {
  title: string;
  organization: string;
  contentType: string;
  url: string;
  publication: string;
  person: string;
  personTitle: string;
  personLinkedIn: string;
  personOrg: string;
  datePublished: string;
  topics: string[];
  tags: string[];
  industry: string[];
  assets: string[];
  category: string;
}

function parseTanaFile(content: string, filename: string): TanaMetadata {
  const lines = content.split('\n');

  const metadata: TanaMetadata = {
    title: filename.replace(/\(my-content\)\.md$/, '').trim(),
    organization: '',
    contentType: '',
    url: '',
    publication: '',
    person: '',
    personTitle: '',
    personLinkedIn: '',
    personOrg: '',
    datePublished: '',
    topics: [],
    tags: [],
    industry: [],
    assets: [],
    category: 'Total Emphasis',
  };

  let inTopics = false;
  let inTags = false;
  let inIndustry = false;
  let inPerson = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Organization
    const orgMatch = line.match(/\*\*Organization\(s\)\*\*:\s*\[([^\]]+)\]/);
    if (orgMatch && !metadata.organization) {
      metadata.organization = orgMatch[1].replace(/\([^)]+\)/, '').trim();
    }

    // Content Type
    const typeMatch = line.match(/\*\*Content Type\*\*:\s*(.+)/);
    if (typeMatch) {
      metadata.contentType = typeMatch[1].trim().replace(/#\w+/, '').trim();
    }

    // URL
    const urlMatch = line.match(/\*\*URL\*\*:\s*\[([^\]]+)\]/);
    if (urlMatch && !metadata.url) {
      metadata.url = urlMatch[1];
    }
    const urlMatch2 = line.match(/\*\*URL\*\*:\s*(https?:\/\/[^\s]+)/);
    if (urlMatch2 && !metadata.url) {
      metadata.url = urlMatch2[1];
    }

    // Publication
    const pubMatch = line.match(/\*\*Publication\*\*:\s*(?:\[)?([^\]\n#]+)/);
    if (pubMatch && !metadata.publication) {
      metadata.publication = pubMatch[1].replace(/\([^)]+\)/, '').replace(/\].*/, '').trim();
    }

    // Date Published
    const dateMatch = line.match(/\*\*Date Published\*\*:\s*\*(\d{4}-\d{2}-\d{2})\*/);
    if (dateMatch) {
      metadata.datePublished = dateMatch[1];
    }

    // Category
    const catMatch = line.match(/\*\*Category Classification\*\*:\s*\[([^\]]+)\]/);
    if (catMatch) {
      metadata.category = catMatch[1].replace(/\([^)]+\)/, '').trim();
    }

    // Asset
    const assetMatch = line.match(/\*\*Asset\*\*:\s*(?:!\[[^\]]*\]\([^)]+\)|([^\n]+))/);
    if (assetMatch) {
      const assetName = assetMatch[1] || line.match(/!\[([^\]]+)\]/)?.[1] || '';
      if (assetName && !metadata.assets.includes(assetName.trim())) {
        metadata.assets.push(assetName.trim());
      }
    }

    // Topics
    if (line.includes('**Topic(s)**:')) {
      inTopics = true;
      inTags = false;
      inIndustry = false;
      inPerson = false;
      const topicMatch = line.match(/\*\*Topic\(s\)\*\*:\s*\[([^\]]+)\]/);
      if (topicMatch) {
        metadata.topics.push(topicMatch[1].replace(/\([^)]+\)/, '').trim());
        inTopics = false;
      }
      continue;
    }

    // Content Tags
    if (line.includes('**Content Tags**:')) {
      inTags = true;
      inTopics = false;
      inIndustry = false;
      inPerson = false;
      const tagMatch = line.match(/\*\*Content Tags\*\*:\s*\[([^\]]+)\]/);
      if (tagMatch) {
        metadata.tags.push(tagMatch[1].replace(/\([^)]+\)/, '').trim());
        inTags = false;
      }
      continue;
    }

    // Industry
    if (line.includes('**Industry**:')) {
      inIndustry = true;
      inTopics = false;
      inTags = false;
      inPerson = false;
      const indMatch = line.match(/\*\*Industry\*\*:\s*(?:\[)?([^\]\n#]+)/);
      if (indMatch) {
        const ind = indMatch[1].replace(/\([^)]+\)/, '').trim();
        if (ind && !metadata.industry.includes(ind)) {
          metadata.industry.push(ind);
        }
        inIndustry = false;
      }
      continue;
    }

    // Person
    if (line.includes('**Person**:')) {
      inPerson = true;
      inTopics = false;
      inTags = false;
      inIndustry = false;
      const personMatch = line.match(/\*\*Person\*\*:\s*\[([^\]]+)\]/);
      if (personMatch) {
        metadata.person = personMatch[1].replace(/\([^)]+\)/, '').trim();
        inPerson = false;
      } else {
        const personMatch2 = line.match(/\*\*Person\*\*:\s*([^\n#]+)/);
        if (personMatch2 && personMatch2[1].trim()) {
          metadata.person = personMatch2[1].replace(/#\w+/, '').trim();
          inPerson = false;
        }
      }
      continue;
    }

    // Handle multi-line arrays
    if (inTopics && line.match(/^\s+-\s*\[/)) {
      const match = line.match(/\[([^\]]+)\]/);
      if (match) {
        metadata.topics.push(match[1].replace(/\([^)]+\)/, '').trim());
      }
    }

    if (inTags && line.match(/^\s+-\s/)) {
      const match = line.match(/\[([^\]]+)\]/) || line.match(/^\s+-\s+([^#\n]+)/);
      if (match) {
        const tag = match[1].replace(/\([^)]+\)/, '').replace(/#\w+/, '').trim();
        if (tag && !metadata.tags.includes(tag)) {
          metadata.tags.push(tag);
        }
      }
    }

    if (inIndustry && line.match(/^\s+-\s/)) {
      const match = line.match(/\[([^\]]+)\]/) || line.match(/^\s+-\s+([^#\n]+)/);
      if (match) {
        const ind = match[1].replace(/\([^)]+\)/, '').replace(/#\w+/, '').trim();
        if (ind && !metadata.industry.includes(ind)) {
          metadata.industry.push(ind);
        }
      }
    }

    // Person sub-fields
    if (inPerson && line.includes('**Job Title**:')) {
      const match = line.match(/\*\*Job Title\*\*:\s*(.+)/);
      if (match) metadata.personTitle = match[1].trim();
    }
    if (inPerson && line.includes('**LinkedIn**:')) {
      const match = line.match(/\*\*LinkedIn\*\*:\s*\[([^\]]+)\]/);
      if (match) metadata.personLinkedIn = match[1];
    }
    if (inPerson && line.includes('**Current Organization**:')) {
      const match = line.match(/\*\*Current Organization\*\*:\s*\[([^\]]+)\]/);
      if (match) metadata.personOrg = match[1].replace(/\([^)]+\)/, '').trim();
    }

    // Reset flags on non-indented lines
    if (!line.match(/^\s/) && !line.startsWith('-')) {
      if (!line.includes('**')) {
        inTopics = false;
        inTags = false;
        inIndustry = false;
      }
    }
  }

  return metadata;
}

function findVaultFile(org: string, title: string): string | null {
  const searchDirs = [
    `${VAULT_BASE}/Clients/Live`,
    `${VAULT_BASE}/Clients/Dormant`,
    `${VAULT_BASE}/Clients/On hold`,
    `${VAULT_BASE}/Clients/Prospect For New Work`,
    `${VAULT_BASE}/Other`,
  ];

  const orgNormalized = org.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const searchDir of searchDirs) {
    if (!fs.existsSync(searchDir)) continue;

    const orgDirs = fs.readdirSync(searchDir);
    for (const orgDir of orgDirs) {
      const orgDirNormalized = orgDir.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (orgDirNormalized.includes(orgNormalized) || orgNormalized.includes(orgDirNormalized)) {
        const contentDir = path.join(searchDir, orgDir, 'Content');
        if (fs.existsSync(contentDir)) {
          const files = fs.readdirSync(contentDir);
          const titleNormalized = title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 40);
          for (const file of files) {
            const fileNormalized = file.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 40);
            if (fileNormalized.includes(titleNormalized) || titleNormalized.includes(fileNormalized)) {
              return path.join(contentDir, file);
            }
          }
          return path.join(contentDir, `${title}.md`);
        }
      }
    }
  }

  return null;
}

function generateFrontmatter(meta: TanaMetadata): string {
  const lines = [
    '---',
    'type: my-content',
    `content_type: ${meta.contentType || 'Unknown'}`,
    `organization: "[[${meta.organization}]]"`,
  ];

  if (meta.url) lines.push(`url: "${meta.url}"`);
  if (meta.publication) lines.push(`publication: "${meta.publication}"`);
  if (meta.person) lines.push(`person: "[[${meta.person}]]"`);
  if (meta.personTitle) lines.push(`personTitle: "${meta.personTitle}"`);
  if (meta.personLinkedIn) lines.push(`personLinkedIn: "${meta.personLinkedIn}"`);
  if (meta.personOrg) lines.push(`personOrg: "[[${meta.personOrg}]]"`);
  if (meta.datePublished) lines.push(`published: ${meta.datePublished}`);

  if (meta.topics.length > 0) {
    lines.push('topics:');
    meta.topics.forEach(t => lines.push(`  - "${t}"`));
  }

  if (meta.tags.length > 0) {
    lines.push('tags:');
    meta.tags.forEach(t => lines.push(`  - "${t}"`));
  }

  if (meta.industry.length > 0) {
    lines.push('industry:');
    meta.industry.forEach(i => lines.push(`  - "${i}"`));
  }

  lines.push(`category: ${meta.category}`);

  if (meta.assets.length > 0) {
    lines.push('assets:');
    meta.assets.forEach(a => lines.push(`  - "${a}"`));
  }

  lines.push('---');
  return lines.join('\n');
}

function generateNewFileBody(meta: TanaMetadata): string {
  const lines = [
    `# ${meta.title}`,
    '',
    `- **Organization(s)**: [[${meta.organization}]]`,
  ];

  if (meta.person) lines.push(`- **Person**: [[${meta.person}]]`);
  if (meta.publication) lines.push(`- **Publication**: ${meta.publication}`);
  if (meta.datePublished) lines.push(`- **Date Published**: ${meta.datePublished}`);
  if (meta.url) lines.push(``, `[View Content](${meta.url})`);

  lines.push('', '---', '', '## Article Content', '', '#needs-copy', '');

  return lines.join('\n');
}

function extractExistingBody(content: string): string {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1] : '';
}

async function main() {
  console.log('Processing previously skipped files...\n');

  const tanaFiles = fs.readdirSync(TANA_EXPORT_DIR)
    .filter(f => f.endsWith('.md') && f.includes('my-content'));

  console.log(`Scanning ${tanaFiles.length} Tana files for skipped orgs...\n`);

  let merged = 0;
  let created = 0;
  let errors = 0;
  let skipped = 0;

  for (const tanaFile of tanaFiles) {
    const tanaPath = path.join(TANA_EXPORT_DIR, tanaFile);

    try {
      const tanaContent = fs.readFileSync(tanaPath, 'utf-8');
      const metadata = parseTanaFile(tanaContent, tanaFile);

      if (!metadata.organization) {
        continue;
      }

      // Only process files from skipped orgs
      const orgLower = metadata.organization.toLowerCase();
      if (!SKIPPED_ORGS.some(skip => orgLower.includes(skip) || skip.includes(orgLower))) {
        continue;
      }

      console.log(`Processing: ${metadata.organization} - ${metadata.title.substring(0, 40)}...`);

      const vaultPath = findVaultFile(metadata.organization, metadata.title);

      if (!vaultPath) {
        console.log(`  ⚠️ Still no vault path found`);
        skipped++;
        continue;
      }

      const newFrontmatter = generateFrontmatter(metadata);

      if (fs.existsSync(vaultPath)) {
        const existingContent = fs.readFileSync(vaultPath, 'utf-8');
        const existingBody = extractExistingBody(existingContent);
        const newContent = newFrontmatter + '\n' + existingBody;
        fs.writeFileSync(vaultPath, newContent);
        console.log(`  ✅ Merged`);
        merged++;
      } else {
        const dir = path.dirname(vaultPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        const newBody = generateNewFileBody(metadata);
        const newContent = newFrontmatter + '\n' + newBody;
        fs.writeFileSync(vaultPath, newContent);
        console.log(`  ✅ Created`);
        created++;
      }

    } catch (err) {
      console.log(`❌ Error processing ${tanaFile}: ${err}`);
      errors++;
    }
  }

  console.log('\n========================================');
  console.log(`✅ Merged: ${merged}`);
  console.log(`✅ Created: ${created}`);
  console.log(`⚠️  Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📊 Total processed: ${merged + created + skipped + errors}`);
}

main();

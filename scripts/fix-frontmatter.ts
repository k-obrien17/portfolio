import * as fs from 'fs';
import * as path from 'path';

// Files processed by the agent that need fixing (files 21-40)
const filesToFix = [
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Clients/Dormant/GoodTime.io/Content/7 Bold Bets for 2023 Talent Acquisition - GoodTime.io - Byline.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Clients/Dormant/Matik/Content/7 Steps to Maximize Your Renewal Success Rate - Matik - Byline.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Clients/Dormant/Socialize/Content/7 Things We Learned This Year About Social Media - Socialize - Blog.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Clients/Dormant/UST/Content/7 Ways Frictionless Shopping Creates Fast ROI for Convenience Stores - UST - Blog.md',
  "/Users/keithobrien/PersonalOps/vault/020-Organizations/Clients/Prospect For New Work/Realeyes/Content/A Master Thesis- Unpacking the Definition of 'Attention as a Metric' - Realeyes - Interview.md",
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Clients/Prospect For New Work/Bank of America/Content/A winning investment - Bank of America - Sponsored Content.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Clients/Dormant/Data Zoo/Content/Account Opening Fraud- Common Pain Points - Data Zoo - Blog.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Other/Google DeepMind/Content/ACE-Uganda and Google DeepMind Partner to enable AI-powered Scientific Research - Google DeepMind - Blog.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Other/IBM/Content/Achieving Cloud Excellence and Efficiency With Cloud Maturity Models - IBM - Blog.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Clients/Live/Northern Trust/Content/Adapt or Get Left Behind- The Playbook for Corporate Change - Northern Trust - Blog.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Clients/Dormant/Circana/Content/Adding Sales Effect Outcomes to Marketing Mix Models Unlocks Insights - Circana - Blog.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Clients/Dormant/PR Council/Content/Addressing Mental Health, From Leading HR Executives - PR Council - Blog.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Clients/Prospect For New Work/Realeyes/Content/Ads Whose Brand DNA Triggers Emotion, Always Wins - Realeyes - Blog.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Other/Google DeepMind/Content/Advancing Gemini\'s Security Safeguards - Google DeepMind - Blog.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Clients/Live/UpWave/Content/Advertising Predictions That Will Shake Up the Media Industry in 2023 - UpWave - Sponsored Content.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Other/McKinsey/Content/Agility - McKinsey - LinkedIn post.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Clients/Dormant/GoodTime.io/Content/Ahryun Moon of Goodtime- 5 Things I Wish Someone Told Me Before I Became a Founder - GoodTime.io - Blog.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Other/McKinsey/Content/AI + Drug Discovery - McKinsey - LinkedIn post.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Clients/Dormant/UIPath/Content/AI and automation- How manufacturing is winning - UIPath - Blog.md',
  '/Users/keithobrien/PersonalOps/vault/020-Organizations/Other/McKinsey/Content/AI and Healthcare - McKinsey - LinkedIn post.md',
];

function extractWikilinkText(value: string): string {
  // Convert [[Text]] or "[[Text]]" to just "Text"
  const match = value.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/);
  return match ? match[1] : value.replace(/^"|"$/g, '');
}

function extractPublicationFromBody(body: string): string | null {
  // Look for **Publication**: pattern in body
  const match = body.match(/\*\*Publication\*\*:\s*(?:\[\[)?([^\n\]#]+)/);
  if (match) {
    return match[1].trim().replace(/\|.*/, '').replace(/\]\].*/, '');
  }
  return null;
}

function fixFrontmatter(content: string): string {
  // Split into frontmatter and body
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    console.log('  No frontmatter found, skipping');
    return content;
  }

  const frontmatterRaw = frontmatterMatch[1];
  const body = frontmatterMatch[2];

  // Parse frontmatter lines
  const lines = frontmatterRaw.split('\n');
  const newLines: string[] = [];
  let hasPublication = false;
  let hasCategory = false;
  let inArray = false;
  let currentArrayField = '';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Check for publication
    if (line.startsWith('publication:')) {
      hasPublication = true;
    }
    // Check for category
    if (line.startsWith('category:')) {
      hasCategory = true;
    }

    // Detect array start
    if (line.match(/^(topics|tags|industry|assets):$/)) {
      currentArrayField = line.replace(':', '');
      inArray = true;
      newLines.push(line);
      continue;
    }

    // Handle array items - strip wikilinks
    if (inArray && line.match(/^\s+-\s/)) {
      const value = line.replace(/^\s+-\s*/, '').trim();
      const cleanValue = extractWikilinkText(value);
      newLines.push(`  - "${cleanValue}"`);
      continue;
    }

    // End of array
    if (inArray && !line.match(/^\s+-/) && line.trim() !== '') {
      inArray = false;
      currentArrayField = '';
    }

    newLines.push(line);
  }

  // Add missing publication from body
  if (!hasPublication) {
    const publication = extractPublicationFromBody(body);
    if (publication) {
      // Find where to insert (after url or published)
      const insertIndex = newLines.findIndex(l => l.startsWith('published:'));
      if (insertIndex >= 0) {
        newLines.splice(insertIndex + 1, 0, `publication: "${publication}"`);
        console.log(`  Added publication: ${publication}`);
      }
    }
  }

  // Add missing category
  if (!hasCategory) {
    // Insert before assets or at end
    const assetsIndex = newLines.findIndex(l => l.startsWith('assets:'));
    if (assetsIndex >= 0) {
      newLines.splice(assetsIndex, 0, 'category: Total Emphasis');
    } else {
      newLines.push('category: Total Emphasis');
    }
    console.log('  Added category: Total Emphasis');
  }

  return `---\n${newLines.join('\n')}\n---\n${body}`;
}

// Main execution
console.log('Fixing frontmatter in agent-processed files...\n');

let fixed = 0;
let errors = 0;

for (const filePath of filesToFix) {
  console.log(`Processing: ${path.basename(filePath)}`);

  try {
    if (!fs.existsSync(filePath)) {
      console.log(`  File not found, skipping`);
      errors++;
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const fixedContent = fixFrontmatter(content);

    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent);
      console.log('  ✅ Fixed');
      fixed++;
    } else {
      console.log('  No changes needed');
    }
  } catch (err) {
    console.log(`  ❌ Error: ${err}`);
    errors++;
  }
}

console.log(`\nDone! Fixed: ${fixed}, Errors: ${errors}`);

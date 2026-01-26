# How to Add New Content

This guide explains how to add new work to your portfolio using the taxonomy system.

## Content Schema

Each piece of content in `data/content.json` has this structure:

```json
{
  "id": "unique-slug-with-date-abc123",
  "title": "Article Title",
  "url": "https://example.com/article",
  "published": "2025-01-15",
  "contentType": "Byline",
  "publication": "Forbes",
  "person": "John Smith - Acme Corp",
  "organization": "Acme Corp",
  "topics": ["Digital Marketing - Marketing - Business and Economics"],
  "tags": ["B2B Marketing", "Content Strategy"]
}
```

## Content Types → Work Types

Your `contentType` field automatically maps to these display categories:

| contentType (in JSON) | Displays As |
|-----------------------|-------------|
| `Byline` | Articles |
| `Sponsored Content` | Articles |
| `LinkedIn post` | Social |
| `Blog` | Blogs |
| `Newsletter` | Blogs |
| `White Paper` | Research |
| `Report` | Research |
| `Annual Report` | Research |
| `Topic Page` | Research |
| `Case Study` | Case Studies |
| `Interview` | Case Studies |

## Problem Areas (Auto-detected)

The system automatically categorizes content by problem area based on topics and tags:

| Problem Area | Keywords that trigger it |
|--------------|--------------------------|
| Marketing & Ads | Marketing, Media Buying, Advertising, Brand, Creative |
| AI & Tech | Artificial Intelligence, Information Technology, Software, Cloud, Cybersecurity |
| Sales & Growth | Sales, Business Strategy, Growth, Revenue, Entrepreneurship |
| Finance | Finance, Accounting, Legal, Insurance, Investing |
| Product | Product, Engineering, Development, Infrastructure |
| People & Culture | Human Resources, Leadership, Culture, Employee, DEI |
| Health | Health, Mental Health, Sleep, Wellness, Medicine |

## Adding New Content

### Step 1: Create the JSON entry

Add a new object to `data/content.json`:

```json
{
  "id": "my-new-article-client-2025-01-20-xyz789",
  "title": "How to Build a Content Strategy That Drives Revenue",
  "url": "https://forbes.com/my-article",
  "published": "2025-01-20",
  "contentType": "Byline",
  "publication": "Forbes",
  "person": "Jane Doe - TechCorp",
  "organization": "TechCorp",
  "topics": ["Content Marketing - Marketing - Business and Economics"],
  "tags": ["Content Strategy", "B2B Marketing", "Revenue Growth"]
}
```

### Step 2: Choose the right contentType

Pick from these values based on what the content is:

- **Byline** - Article published under someone's name in a publication
- **Sponsored Content** - Paid content placement
- **LinkedIn post** - LinkedIn thought leadership post
- **Blog** - Company blog post
- **Newsletter** - Newsletter content
- **White Paper** - Long-form research document
- **Report** - Data-driven analysis
- **Case Study** - Client success story
- **Interview** - Q&A or profile piece

### Step 3: Add relevant tags

Tags help with search and filtering. Use 1-4 tags that describe:
- The main topic (e.g., "Content Strategy")
- The industry context (e.g., "B2B Marketing")
- Any specific outcomes (e.g., "Revenue Growth")

### Step 4: Format the ID

IDs should be URL-safe slugs. Format: `title-slug-client-date-randomchars`

Example: `content-strategy-techcorp-2025-01-20-abc123`

## Updating Featured Work

To change which pieces appear in the "Featured work" section on the homepage, edit `lib/featured.ts`:

```typescript
const FEATURED_IDS = [
  "your-featured-id-1",
  "your-featured-id-2",
  // Add 3-5 IDs of your best work
];
```

Choose pieces that:
- Show range (different content types)
- Have strong outcomes
- Represent different clients/industries

## Taxonomy Files

- `lib/taxonomy.ts` - Work type and problem area definitions
- `lib/featured.ts` - Featured content curation
- `data/content.json` - All content data

# Admin Interface Setup

## URLs

- **Main site**: http://localhost:3000
- **Writing page**: http://localhost:3000/writing
- **Style variations**: http://localhost:3000/writing/styles (compare 4 different looks)
- **Admin login**: http://localhost:3000/admin/login
- **Admin dashboard**: http://localhost:3000/admin

## Credentials

- Password: `caper1Pants7#`

## Database

Using Neon Postgres (via Vercel Storage).

Connection string is in `.env.local`.

## First Time Setup

1. Go to /admin/login
2. Enter password
3. Click "Initialize Database & Import Content" to seed from JSON

## Deploying to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` (your Neon connection string)
   - `ADMIN_PASSWORD` (your admin password)
4. Deploy

## Style Variations

Visit `/writing/styles` to see 4 different design approaches:

1. **Minimal List** - Clean typography-focused list
2. **Magazine** - Editorial style with featured cards
3. **Tag Cloud** - Tags as the primary navigation
4. **Dense Grid** - Compact grid layout

Pick your favorite and let me know - I can apply it to the main `/writing` page.

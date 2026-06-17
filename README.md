# Personal Harvest Helper

The official website for the Personal Harvest Helper gardening app. A fast, SEO-optimized static site built for Cloudflare Pages + GitHub.

## Tech Stack

- **Hosting**: Cloudflare Pages (free tier)
- **Source Control**: GitHub
- **Stack**: Plain HTML + CSS + JavaScript (no build tools needed)

## How To Use This Site

### View the site
Open `index.html` in a browser, or deploy to Cloudflare Pages.

### Edit a page
1. Go to the GitHub repository
2. Navigate to the page you want to edit (e.g., `about/index.html`)
3. Click the pencil icon to edit
4. Make your changes and commit

### Add a new blog post
1. Copy an existing blog post folder (e.g., `blog/how-to-grow-tomatoes/`)
2. Rename the folder to your post's URL slug
3. Edit the `index.html` inside — update title, meta description, content
4. Add it to the blog listing (`blog/index.html`) and the appropriate category page
5. Update `sitemap.xml` with the new URL

### Deploy
Push to GitHub. Cloudflare Pages auto-deploys from the `main` branch.

## File Structure

```
/
├── index.html              # Home page
├── about/index.html        # About page
├── blog/index.html         # Blog listing
├── blog/[post-slug]/       # Individual blog posts (25 total)
├── categories/[category]/  # Category pages (8 total)
├── contact/index.html      # Contact page
├── waitlist/index.html     # Waitlist signup
├── privacy-policy/         # Privacy policy
├── terms-of-use/           # Terms of use
├── css/style.css           # Stylesheet
├── js/main.js              # JavaScript
├── images/                 # Images and icons
├── sitemap.xml             # Search engine sitemap
├── rss.xml                 # RSS feed
└── robots.txt              # Search engine rules
```
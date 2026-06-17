# Site Maintenance Guide

This guide explains how to maintain PersonalHarvestHelper.com using GitHub. No technical skills required beyond a web browser.

---

## Table of Contents

1. [How Publishing Works](#1-how-publishing-works)
2. [Reviewing New Blog Posts](#2-reviewing-new-blog-posts)
3. [Editing an Existing Page or Post](#3-editing-an-existing-page-or-post)
4. [Adding a New Blog Post](#4-adding-a-new-blog-post)
5. [Adding a New Page](#5-adding-a-new-page)
6. [Updating the Waitlist Form for Your CRM](#6-updating-the-waitlist-form-for-your-crm)
7. [Changing the CTA After App Launch](#7-changing-the-cta-after-app-launch)
8. [Adding Real Photos](#8-adding-real-photos)
9. [Managing Categories](#9-managing-categories)

---

## 1. How Publishing Works

The site uses **GitHub** for storage and **Cloudflare Pages** for hosting.

**The flow:**
1. I (or you) write content and push it to GitHub
2. Cloudflare Pages automatically detects the change
3. Cloudflare rebuilds the static site and deploys it
4. The live site at personalharvesthelper.com updates within minutes

**Nothing goes live without your approval.** All new content goes through Pull Requests (PRs).

---

## 2. Reviewing New Blog Posts

When new blog posts are ready, I will create a **Pull Request (PR)** on GitHub. Here is how to review and approve:

1. **Go to the GitHub repository**
2. Click the **"Pull Requests"** tab
3. Click on the PR I created (it will say something like "New blog posts week of ...")
4. You will see a list of changed files — these are the new posts
5. **To read a post:** Click on a file name (e.g., `blog/new-post-slug/index.html`)
6. **To suggest an edit:** Click the pencil icon while viewing the file, make changes, and save
7. **To approve:** Click the **"Files changed"** tab, then **"Review changes"**, select "Approve", and submit
8. **To publish:** Click **"Merge pull request"** — this deploys the site

**Tip:** You can also edit posts directly after they are live by following section 3 below.

---

## 3. Editing an Existing Page or Post

You can edit any page directly on GitHub without any software:

1. **Go to the GitHub repository**
2. Navigate to the file you want to edit:
   - Home page: `index.html`
   - About page: `about/index.html`
   - Blog post: `blog/[post-slug]/index.html`
   - Contact page: `contact/index.html`
3. Click the file name to open it
4. Click the **pencil icon** (top right of the file view)
5. Make your edits in the text editor
6. Scroll down to **"Commit changes"**
7. Write a brief description (e.g., "Fixed typo on home page")
8. Click **"Commit changes"** — the site updates automatically

---

## 4. Adding a New Blog Post

To add a new blog post yourself:

### Option A: Copy an existing post (easiest)
1. On GitHub, navigate to an existing blog post folder: `blog/how-to-grow-tomatoes/`
2. Click **"Add file"** > **"Create new file"**
3. In the file path, type: `blog/your-post-slug/index.html`
4. Copy the content from an existing post's `index.html` and paste it
5. Edit the title, meta description, date, and article content
6. Update the featured image URL
7. Commit the file

### Option B: Ask me to write it
Just tell me the topic and I will draft it, send it as a Pull Request, and wait for your approval.

**After adding a post, you should:**
- Add it to `blog/index.html` (insert a new blog card in the grid)
- Add it to the relevant category page in `categories/[category]/index.html`
- Update `sitemap.xml` with the new URL

---

## 5. Adding a New Page

1. Create a new folder in the repository (e.g., `new-page-name/`)
2. Create an `index.html` file inside it
3. Use an existing page as a template (copy the header, navigation, and footer)
4. Add your content in the `<main>` section
5. Add a link in the site navigation in every page's header
6. Add it to `sitemap.xml`
7. Add it to the footer on every page

This is easier to just ask me to do — happy to handle it.

---

## 6. Updating the Waitlist Form for Your CRM

The waitlist form is currently set to `action="#"` (placeholder). When you choose your CRM or email platform:

1. **Get the form action URL** from your CRM (e.g., Mailchimp, ConvertKit, HubSpot)
2. Open `waitlist/index.html` on GitHub
3. Find the `<form>` tag — it looks like:
   ```html
   <form class="signup-form" action="#" method="POST">
   ```
4. Replace `action="#"` with your form action URL
5. If your CRM needs specific input name attributes, update the `<input>` fields accordingly
6. If your CRM provides **embed code**, replace the entire `<form>` block with your embed code
7. Repeat the same change on `index.html`, `blog/index.html`, and any blog post signup forms (search for `signup-form`)

Common CRM form action examples:
- **Mailchimp**: `action="https://[username].us18.list-manage.com/subscribe/post?u=...&id=..."`  
- **ConvertKit**: `action="https://app.convertkit.com/forms/[id]/subscriptions"`
- **Webhook**: `action="https://your-webhook-url.com/subscribe"`

---

## 7. Changing the CTA After App Launch

When the app launches, you will want to change "Join the Waitlist" to "Get the App" across the entire site:

1. Open any file in the repository
2. Use GitHub's **find and replace** feature (or just search for "Join the Waitlist")
3. Replace all instances with "Get the App"
4. Also update the button links from `/waitlist/` to wherever the app download page is
5. Update `index.html` pricing section — remove Founding Member pricing, keep monthly/yearly
6. Commit all changes — the site redeploys automatically

**Tip:** This change affects every page, so it is best to find and replace across all files at once. I can handle this for you when the time comes.

---

## 8. Adding Real Photos

The site currently uses Unsplash photography URLs for featured images and hero sections. These auto-load from Unsplash's free CDN. If you want to host your own images:

1. Upload your image to the `images/` folder in the repository
2. Find the `<img>` tag with the Unsplash URL you want to replace
3. Change `src="https://images.unsplash.com/..."` to `src="/images/your-photo.jpg"`
4. Keep the `alt` text descriptive (it helps with SEO and accessibility)

**Image tips:**
- Use JPEG for photos, PNG for graphics, SVG for icons
- Keep images under 200KB for fast loading
- Always include descriptive `alt` text

---

## 9. Managing Categories

Blog categories are:
- **Beginner Gardening** — `/categories/beginner-gardening/`
- **What to Plant This Month** — `/categories/what-to-plant-this-month/`
- **Vegetable Guides** — `/categories/vegetable-guides/`
- **Herb Guides** — `/categories/herb-guides/`
- **Watering Help** — `/categories/watering-help/`
- **Garden Problems** — `/categories/garden-problems/`
- **Raised Bed Gardening** — `/categories/raised-bed-gardening/`
- **Container Gardening** — `/categories/container-gardening/`

Each category has a page listing all posts in that category. When you add a new post:
1. Decide which category it belongs to
2. Set the `post-category` link in the post header to point to `../categories/[category]/`
3. Add the post's card to the category's `index.html`

---

## Need Help?

If anything here is unclear, or if you want me to handle any update, just ask. That is what I am here for.
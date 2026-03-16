

# SEO Improvements -- Round 2

Based on research into 2026 SEO best practices and analysis of the current codebase, here are 5 high-impact improvements still missing:

---

## 1. Blog Pagination (Crawl Budget + UX)

Currently, the blog loads ALL posts at once with no pagination. This hurts crawl budget (Google sees one giant page instead of discoverable paginated archives) and performance on mobile.

**Implementation:** Add numbered pagination (12 posts per page) with `rel="prev"` / `rel="next"` link tags in `<head>` and self-referencing canonicals per page. URL pattern: `/blog?page=2`.

**File:** `src/pages/Blog.tsx`, `src/components/SEOHead.tsx`

---

## 2. Speakable Schema for Blog Posts (Voice Search + AI)

Google supports `speakable` structured data to identify which sections of an article are best suited for text-to-speech and voice assistant answers. This is highly relevant for GEO (Generative Engine Optimization).

**Implementation:** Add `speakable` property to the `BlogPosting` schema in `SEOHead.tsx`, targeting the post title and excerpt (CSS selectors or xPath).

**File:** `src/components/SEOHead.tsx`

---

## 3. SiteNavigationElement Schema (Sitelinks)

Adding `SiteNavigationElement` structured data helps Google generate rich sitelinks in search results, mapping the main navigation structure.

**Implementation:** Add a `SiteNavigationElement` schema to the home page that mirrors the Header navigation links (Home, Abrir Empresa, Segmentos, Blog, Contato, etc.).

**File:** `src/lib/seo-schemas.ts`, `src/pages/Index.tsx`

---

## 4. WebSite + SearchAction Schema (Sitelinks Search Box)

Adding `WebSite` schema with `potentialAction: SearchAction` enables Google to display a search box directly in search results for branded queries.

**Implementation:** Add a `WebSite` schema with `SearchAction` pointing to `/blog?q={search_term}` and wire the blog search to read from URL params.

**File:** `src/lib/seo-schemas.ts`, `src/pages/Index.tsx`, `src/pages/Blog.tsx`

---

## 5. Last-Modified Meta + If-Modified-Since Headers for Blog

Currently blog posts don't signal freshness to crawlers beyond the schema `dateModified`. Adding `last-modified` HTTP-equivalent meta tags and exposing `updated_at` in the page helps crawlers prioritize fresh content.

**Implementation:** Add `<meta http-equiv="last-modified">` to blog posts using the `updated_at` field from the database.

**File:** `src/components/SEOHead.tsx`, `src/pages/BlogPost.tsx`

---

## Technical Details

### Files to edit:
1. **`src/pages/Blog.tsx`** -- Add pagination state, URL param sync, paginated rendering
2. **`src/components/SEOHead.tsx`** -- Add `rel="prev/next"`, `speakable` in BlogPosting, `last-modified` meta
3. **`src/lib/seo-schemas.ts`** -- Add `WebSite+SearchAction` and `SiteNavigationElement` schemas
4. **`src/pages/Index.tsx`** -- Include new schemas on homepage

### Estimated changes: 4 files edited, 0 new files.


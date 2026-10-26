# Writing: Xevrion reference reconstruction

Source: https://xevrion.dev/blogs/digitalocean-to-vercel and homepage writing rows.
Captured 26 October 2026 using Firecrawl branding/images and read-only browser measurements.
Raw captures: `.firecrawl/xevrion-article-branding.json`; screenshot scrape metadata in `.firecrawl/xevrion-article-screenshot.png` (not a binary image).

## Observed design
Geist body/heading, Paper Mono metadata and code. Reference dark background #0a0a0a, foreground #ededed, secondary #a0a0a0. Retain the portfolio's equivalent theme variables in both themes.
Reader column 640px. Title 32px/1.15 weight600, summary16px/1.6. Prose17px/1.75. H2 21px/1.35 weight600, about50px above. Code14px/1.65. Calm metadata, tags, rounded full-width images, heading permalinks, code copying, image enlargement. Desktop contents200px with56px gap; collapsed contents on smaller screens.
Breadcrumb replaces homepage navigation for writing routes. Homepage and archive use single headline rows, date and a sliding arrow; omit summaries. Mobile titles truncate visually with full accessible link text.

## Implementation scope
Server-render published Notion content, retain original Hashnode canonical and dates. Real author identity. Related and adjacent published articles. Preserve existing comments and sharing. No fabricated read counts, likes, or update dates. Colour-highlights control is a client island. Image dialog supports Escape and focus restoration. Reduced motion disables sliding effects. No new fonts or runtime dependencies.
Mobile homepage headings use Arman's bold mixed-case hierarchy (28px/1.25, weight700) with the existing paired separators. No section glow or new boxes.

## Rerun
workflow: firecrawl-website-design-clone
source_url: https://xevrion.dev/blogs/digitalocean-to-vercel
target_stack: Next.js App Router / React / TypeScript
output: DESIGN.md

## Reverse engineering evidence
REA 6.7.0 statically analyzed the two shipped reader script chunks containing image, colour and code controls. Evidence `ev_f6975fcc7cd72b4915debb6838516a5a6b4f15c58359ed92ccb15462601f6dfa` is retained under ignored `test-results/app/reader-rea-focused.json`. The initial whole-bundle run timed out; the focused run completed. Its static observations do not prove runtime execution. Browser measurements/actions provide runtime visual evidence. Other 23 inventoried artifacts were outside focused analysis scope.

# Projects: Xevrion archive reference
Source: https://xevrion.dev/projects, captured 26 October 2026. Firecrawl branding/images and screenshot capture metadata live under `.firecrawl/xevrion-projects-*`; read-only DOM inspection establishes structure and motion classes.

The reference uses a 640px archive with a breadcrumb, small introduction, then current projects as a single vertical list of wide preview cards. Cards have 20px corners, flat subtle surfaces, a 1200/420 desktop preview (1200/500 mobile), 40px icons, 15px titles, 14px/1.6 descriptions and 11px tags. On hover the preview scales to1.03, the icon rotates -6deg/scales1.05, and pressed main links scale the card to0.985. Smaller projects use compact icon rows. Recreate these mechanics with existing owned images/icons, no borrowed project claims or fake stars. No outer glow.

Portfolio adaptation: only Current projects can appear on the homepage; Side quests live on /projects as compact rows. Preserve direct card-to-project-detail links and the GitHub README reader. No empty Past section. Published Notion Projects gain a Collection field so the owner can move work between Current projects and Side quests without editing code. Featured remains a homepage-selection flag within Current projects.

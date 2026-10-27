# Off the Clock review — 27 October 2026

The shared collection browser covers books, watchlist, places, articles/papers and channels. Public content remains server rendered; client state handles search, filters and gallery interaction. Book records require both the Books shelf and Book format. No sample opinions or channel recommendations were published.

## Verified

- Search for Atomic returns Atomic Habits; Currently reading returns The 7 Habits of Highly Effective People. Combined Anime / Watching returns Vinland Saga. Want to go returns Japan and Silicon Valley.
- At 320px, books, places, articles and channels had no horizontal document overflow. The 390px watchlist had no overflow or broken loaded artwork.
- Seven collection/diary axe runs had no automated violations. Two contrast checks were incomplete on an animated dock prompt or a horizontally clipped filter. This is not a WCAG certification or a physical-device test.
- Gallery membership is restricted to Published entries in the correct fixed Notion source and shelf. Unsupported kinds, malformed IDs and missing membership return 404; provider failures return 503 without internal details. Only validated image URLs/captions leave the body reader, capped at 30 photos; ordinary paragraphs are excluded.
- Banaras loads its main image plus two image blocks from the live Notion page body. Next changes the count from 1/3 to 2/3 and shows the Assi Ghat caption. Travel samples are labelled representative and include attribution.
- The final open-gallery axe run at 320×844 had no violations or incomplete checks. Its long caption wraps without horizontal overflow; source attribution is a compact link. The real API returned two extra photos and rejected a book ID queried through the places source with 404.
- Live automatic-artwork smoke checks returned matching sources for Deep Work / Cal Newport, Inception, Dehradun and a linked Substack article. Unknown hosts, unsafe redirects, missing metadata and provider failure are tested as unavailable. Automatic metadata is cached for 24 hours. Owner images are preferred without a provider request; owner notes are preserved.
- The homepage has upright book covers on a shelf, each linking directly to its diary page. Atomic Habits opened its own page; its link is included in the sitemap and dock index. Collection excerpts stay clipped to three lines; full Published body content lives on the note page.
- At 320px the three current book links measured approximately 63–65px wide by 98px high, with no horizontal overflow or broken loaded artwork. Open Library's redirect through Internet Archive is explicitly permitted for images; failed homepage covers fall back to their title.
- Lint, TypeScript, 97 tests and the production build passed. Final gallery phone/accessibility evidence is retained under ignored test-results/app.

No authentication settings, database permissions, paid services or scheduled jobs changed. Notion remains the editor; importing likes is a snapshot, not a continuous Substack sync.

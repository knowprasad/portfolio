# Mobile review — 26 October 2026

Sai's earlier localhost task server on port 50814 was not listening, and its review tab/report was unavailable. Findings below are direct browser measurements and tests, not a Sai-generated review.

## Verified issues and changes

| Finding | Change |
| --- | --- |
| Project demo/source icons had roughly 17×28px hit areas | 44×44px touch targets; original 17px graphics retained |
| Hero social links wrapped across action rows | Dedicated social row on touch layouts |
| Short navigation targets and active sections scrolled out of sight | 44px-high links; active section follows horizontally without scrolling the document |
| Small chart, footer, archive and reading controls | Larger touch targets with existing compact icon artwork |
| Dock clipped above a 390px-high landscape window | Centered, height-bounded scrollable dialog and sticky close/header controls |
| Fixed dock could encroach on bottom controls | Safe-area-aware placement and footer clearance |
| Avatar nudge overlapped the subtitle when the name wrapped at 320px | Keep the nudge within the avatar column and omit its decorative arrow only on very narrow screens |
| A failed search-index load silently stayed on built-in fallback results | Show a failure notice and Retry control; retain built-in pages during failures |
| Reading/archive containers applied a second 20px gutter inside the existing page gutter | Use the parent page's phone gutter; retain the 640px desktop cap |

## Verification

- 320×844, 390×844 and 844×390 viewport checks; touch emulation through Chrome DevTools.
- Homepage, project detail, writing archive, article reader, guestbook and activity page: no horizontal document overflow or broken loaded images in the eight layout cases.
- The heatmap/table/code can scroll inside their dedicated containers; this is intentional and does not widen the document.
- Seven automated WCAG/axe runs: homepage dark/light, landscape, project, guestbook, activity and article. No automated violations. Contrast checks on horizontally clipped navigation remain incomplete in axe; visible navigation uses theme contrast tokens and is inspected separately. These results are not a WCAG certification.
- Project links measured 44×44px. Active section visible in the navigation after selection.
- A landscape dock initially measured top -23.5px; after the short-height fix its bounds were approximately 51px–339px in a 390px-high viewport.
- Search recovery was reproduced with Chrome DevTools Offline mode: the open dock originally had no retry control. After the fix it shows Retry; restoring connectivity and retrying returned the CSS Selectors article first for `CSS` without a page refresh.
- Lint, TypeScript, all 78 tests and the production build passed before release.
- The rebuilt project archive passed additional axe runs at 320px dark and 390px light; homepage selection and the 320px article reader also had no automated violations. Some contrast checks on clipped navigation or image content remained incomplete and require manual assessment.
- Homepage cards contain only Merix and PlateWise. The archive has three Current projects and one Side quest. Selecting Merix opens its detail page directly.

Evidence is kept under ignored `test-results/app/mobile-review/`. No public test comments or messages were posted.

## Limits

These are browser/device-emulation checks. Physical iOS/Android keyboards, Safari-specific rendering, safe-area insets on hardware and audible sound playback need a real-device spot check. The original small stack icon boxes remain unchanged by owner preference; spacing and accessible names are retained.

## Sai follow-up
The reconnected Sai tool accepted the review task, but the free cloud machine refused acquisition because its daily computer-time allowance was exhausted. It returned no device-emulation or visual review findings. Cost reported for this task was $0; no upgrade was attempted. The review and fixes above are direct local browser measurements, not Sai conclusions.

# Accessibility and interaction audit

Date: 26 October 2026. Target: the current Next.js portfolio in site/. This is an engineering audit, not a third-party WCAG certification.

## Method and scope

Used axe-core 4.14.0 through the official Chrome DevTools MCP in an isolated browser. Enabled WCAG 2 A/AA, WCAG 2.1 A/AA, WCAG 2.2 AA and best-practice checks. Tests ran against the local application with its genuine published content. No fake public messages or achievements were created.

The release matrix covers both themes at 1280×900 on Home, Activity, Projects, Merix, Writing, Guestbook, Books, Articles, Watchlist, Channels, Places, Privacy, Résumé and a missing page. It also covers Home/Activity at 320×844, each individual coding-platform tab, the search and compose dock, a technology tooltip, photo reveal, monthly skyline and forced avatar failure. Project cards now navigate directly; the removed project dialog is excluded from the final matrix.

Raw reports and temporary audit scripts are deliberately ignored under test-results/app/accessibility/. The checked-in report records results without publishing browser traces or credentials.

## Results

The final 50-case matrix completed with zero detected violations and zero execution errors. Some color-contrast checks require manual review because of clipped horizontal scrollers or decorative overlaps; these remain recorded as incomplete, not silently counted as automated passes. The baseline homepage had two accessible-name failures and 366 tiny-target failures. Lint, TypeScript, all 53 tests and the production build pass. The dependency audit reports zero known vulnerabilities at this check.

## Fixes

- Contributor and organization images use first-party image optimization; failures show a GitHub symbol while retaining the destination's accessible name and layout.
- The owner's current photo has a first-party delivery route. It accepts only the fixed owner sources, validates every redirect, excludes credentials, limits raster responses to 1 MB and caches briefly. Vercel Preview delivered the current GitHub photo successfully; an unavailable upstream does not reveal an outdated bundled portrait.
- Accessible names now include visible avatar, project and search-trigger text. Decorative typing pauses during keyboard focus and with reduced motion.
- Every main landmark accepts programmatic focus, and the first keyboard link actually moves focus into it.
- Light-theme secondary text and coding-platform accents meet text contrast requirements in the automated scans. Heading order and labelled group/region semantics were repaired.
- The green contribution heatmap remains visually compact. Its hundreds of tiny pseudo-buttons were replaced with a labelled visual summary plus a 44px date control that exposes each day's count in a live caption. The calendar remains keyboard-scrollable.
- Technology tooltips can be dismissed with Escape without losing focus, and remain hoverable across the gap to the icon.
- The photo hint stays inside the narrow phone viewport.
- Project images, titles and card space lead directly to the project page. Source/demo links remain separate real links. Removed the unused modal component and its styles.

## Manual interaction evidence

- First Tab reaches Skip to content; Enter focuses MAIN#main.
- Keyboard activation of a project preview reaches /projects/merix directly, with no project dialog.
- Slash opens search with focus in its combobox. Typing Activity and pressing Enter reaches /activity.
- The native dock dialog uses modal behavior, supports Escape and restores the opener. A prior project-dialog focus test is historical only; that dialog is now removed.
- At 320px, focusing the last horizontal navigation item scrolls it into view. The page itself has no horizontal overflow in the checked layouts.
- Selecting the latest date in the contribution inspector updates its caption to the actual returned daily count. Tooltip Escape dismissal retains the tool link's focus.
- Text clipped only by intentional horizontal navigation/calendar scrolling and overlapping decorative book-cover labels cannot be judged automatically by axe. Visible navigation uses the theme's text tokens; decorative book labels are hidden from assistive technology and have a separate collection label. Reviewed the hint bounds and relevant theme tokens rather than suppressing rules.
- Sound remains opt-in. Browser audio starts after an explicit activation; observed a running audio context and advancing clock. Five regression tests cover opt-out, delayed mobile resume, muting during resume, rejected playback and the Safari-prefixed constructor. A physical iPhone/Android listening test is still required; desktop emulation cannot certify hardware audio or silent-mode behavior. Mobile lifecycle guidance: [MDN Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices).

## Limits and maintenance

Automated checks do not establish complete WCAG conformance. A dedicated screen-reader pass, physical-device testing and the signed-in form in each assistive-technology/browser combination are outside this scan. Genuine production Google sign-in, posting, own deletion and sign-out were verified in earlier release checks; this audit did not publish test comments again.

Future Notion content needs meaningful headings, descriptive link labels and image descriptions. Repeat these checks after significant UI or content changes. Keep both themes, mobile widths, keyboard focus and failure states in release verification.

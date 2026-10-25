# Mobile performance and GitHub profile audit — 2026-10-26

Production: https://knowprasad.me/
Deployment: dpl_GBhyHJXAY39Nwm3zm2DjoneYrA4u

## Measurement
Official Chrome DevTools MCP 1.12.0, isolated headless Chrome, 390×844 viewport at DPR 3, mobile/touch emulation, Slow 4G and 4× CPU slowdown. Each trace reloaded with HTTP cache bypassed. These are lab measurements, not field Core Web Vitals or a Lighthouse score. No INP claim is made.

Before: LCP 2194 ms, CLS 0.1965. DevTools attributed the shift to late web-font loading and flagged an unsized sound-control image.

After: LCP 3384 / 2100 / 2061 ms; median 2100 ms. CLS 0.00 in all three runs. TTFB 771 / 53 / 41 ms explains much of the variability. No meaningful LCP speedup is claimed from a single before run. The verified improvement is elimination of the observed layout shift.

## Changes
- Local fonts retain their preload and use font-display: optional, avoiding a late font swap/reflow on slow first loads. A slow first visit may keep its fallback font; later cached visits use the chosen font.
- Sound-control image receives explicit CSS dimensions.
- Footer flex items have 20px column and 10px row gaps and wrap cleanly.
- GitHub social preview now obtains the public account avatar, name, nullable bio, follower count and public repository count from GitHub’s API with a five-minute server cache. It no longer represents a fixed local portrait as the GitHub avatar. API failure falls back to the existing descriptive link, without invented statistics.

## Freshness findings
At audit time, the public GitHub contribution endpoint and deployed calendar both had 346 contributions across 365 days ending 2026-10-25. The calendar/PR integrations attempt provider reads with a one-hour cache and use labelled saved snapshots on provider failure. They are automatic, not real-time push updates. Other social network preview descriptions remain curated; they are not claimed to be live account APIs.

## Verification
- Public production response 200; actual GitHub avatar and current 6 followers / 31 public repositories found in the rendered payload.
- At 320px and 390px, document width equalled viewport width and the footer gap was 20px with separated items. The 320px DOM had no duplicate IDs.
- ESLint, TypeScript, 31 tests and Vercel production build passed; deployment install reported zero known npm vulnerabilities.
- Raw traces and DOM/network checks are under ignored test-results/app/perf-*.json.
- Global chrome-devtools MCP configured through Codex CLI with an isolated headless browser and usage statistics/CrUX integration disabled. No signed-in personal browser profile is used.

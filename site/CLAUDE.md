# Development

Run development servers in the background with a hidden window. Use npm run dev (port 3001); record the process ID and logs under ignored test-results/. Check the existing process before starting another server. Stop only the process started for this project.

On Windows, use Start-Process -WindowStyle Hidden with redirected output. Keep the user's terminal available.

This is the approved Next.js rebuild. Run these commands from site/. The old Astro application was removed with owner approval. Consult installed Next.js documentation and official docs when changing routing, data fetching or caching.

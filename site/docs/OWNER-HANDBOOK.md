# Your portfolio: owner handbook

Prepared for Shubham Prasad · 26 October 2026

This is the day-to-day guide for managing **https://knowprasad.me/**. You do not need to edit code for ordinary content changes once the Notion publishing connection is enabled. Read the handover checklist for the final verified setup status; this handbook explains how the system operates and what each control does.

## 1. Your control panel

| What you want to manage | Where to go |
| --- | --- |
| Website content | [Portfolio CMS in Notion](https://app.notion.com/p/40442b1c345e815c9edbdf10ac50db93) |
| Notion quick-start guide | [Start here](https://app.notion.com/p/40442b1c345e81eb9bcdda4143b12000) |
| Website source code | [knowprasad/portfolio](https://github.com/knowprasad/portfolio) |
| Deployments and server settings | [Vercel project](https://vercel.com/prsdxdev-7936s-projects/prsdxportfolio) |
| Messages, authentication and database | [Portfolio Supabase project](https://supabase.com/dashboard/project/hhbuhqevmskpuvybiwii) |
| Domain registration and DNS | [Namecheap domain dashboard](https://ap.www.namecheap.com/domains/list/) |
| Your booking availability | [Cal.com](https://cal.com/knowprasad) |
| Default real profile photo | [Your GitHub profile](https://github.com/knowprasad) |

Keep access to these owner accounts. Visitors do not need Notion, Vercel or Supabase dashboard access. Signing into the guestbook does not make someone an administrator.

## 2. The three types of update

**Content:** add a project, update your bio, publish a post, add a book or list a friend. Use Notion. These changes normally need no Git commit or Vercel deployment.

**Connected activity:** GitHub contributions and pull requests, coding-platform statistics and the GitHub profile preview update through provider reads. You normally update the original platform, then allow its cache to refresh.

**Features and design:** a new section, a different layout, a new tool icon, new data provider or a different animation requires a code change. Use the repository and the development/release instructions in OPERATIONS.md.

## 3. The publishing rule

Every content database has a **Publish** field:

| Value | Result |
| --- | --- |
| Draft | Private preparation; excluded from public pages and search |
| Published | Eligible to appear on the website |
| Archived | Hidden from public pages/search while retaining the record |

Use **Order** to place entries: smaller numbers appear first. Use 10, 20, 30 if you want space to insert entries later. The **Featured** checkbox affects the compact project and writing selections; it is not a replacement for Publish.

The normal cache interval is approximately five minutes and is driven by visits. A request after expiry can still receive the previous version while the next version regenerates. Refresh after a little longer if necessary. This is not an instant live editor or an exact timed publishing scheduler. Removing a sensitive item may leave a cached copy briefly; use Vercel cache invalidation/redeployment for an urgent takedown.

Do not publish an instructional starter unchanged. Duplicate it, replace its example values, review it, and then choose Published. A page's normal Notion sharing setting is different from the CMS Publish field: you do not need to make your entire Notion page public.

## 4. Before you publish anything

1. Choose the correct database below.
2. Create a new record or duplicate the matching starter.
3. Keep Publish = Draft while editing.
4. Fill the name and required fields. Use stable, public HTTPS links.
5. Add a cover if relevant; check that it loads outside your account.
6. Check names, dates, claims and links. Avoid private documents and confidential employer/project details.
7. Set Order and Featured where relevant.
8. Change Publish to Published.
9. After the cache refresh, check the homepage and relevant archive/detail page on your phone.

To hide something later, change Publish to Archived. Prefer this over deleting a record you may want again.

## 5. Profile, bio, links and photo

Open **Profile** and edit the existing Shubham Prasad record. Keep one intended public profile record first in Order.

| Field | What it controls |
| --- | --- |
| Name | Main heading |
| Role | Short line beneath your name |
| Bio | Public introduction text |
| Location | Stored profile location; the live time display currently uses India/IST in code |
| Photo | Optional explicit photo override from an approved image host |
| Resume PDF | Link to your actual public résumé PDF |
| GitHub, LinkedIn, X | Social link destinations |
| Booking | Your public Cal.com scheduling link |

The website retains its permanent verified owner identity if no Profile override is Published. Archiving that record removes its custom overrides; it does not take the website or static identity offline.

The **Bio property** is public. The record body is not a separate public About page. Keep useful private drafting notes there, but do not expect them to render beneath your name.

### Changing your photo

By default the revealed real photo follows your public GitHub avatar. Change your profile picture in GitHub's profile settings. The website reads profile metadata with an approximately five-minute server cache; the image CDN/browser may also cache the photo. You do not need to upload it to this repository each time.

To use a different photo just on this website, enter its public approved image URL in **Profile → Photo** and publish that profile. Clear Photo to return to the GitHub default. Approved image hosts are documented in section 14. The photo is delivered through a first-party route with a short cache, so visitors do not need a direct GitHub CDN connection. A failed request shows the anime placeholder with an unavailable label. Use a PNG, JPEG, WebP, AVIF or GIF under 1 MB for a custom photo.

The anime illustration shown before clicking is a separate site asset. It also appears in navigation/favicon artwork. Changing your GitHub photo does not replace that illustration. Replacing the anime illustration or browser icon is a design/code update; see OPERATIONS.md.

Instagram and Substack currently use `knowprasad` URLs in the source profile configuration. Changing those usernames requires a small code edit. Their preview descriptions, and the LinkedIn/X descriptions, are curated summaries rather than authenticated profile feeds. GitHub's preview uses its public API.

## 6. Projects

Open **Projects**. Each record represents one project and can produce both a homepage card and a full `/projects/slug` page.

| Field | How to use it |
| --- | --- |
| Name | The project name visitors see |
| Slug | Unique lowercase words separated by hyphens, such as `my-study-tool` |
| Summary | Concise explanation used in project cards and the overview |
| Project status | Building, Live, Open source, Archived, or Demo paused |
| Live URL | Public demo URL; leave empty when there is no public demo |
| Source URL | Public source repository; leave empty for private repositories |
| Tags | A short set of accurate technologies/topics |
| Image | Explicit approved public cover URL; a supported native Notion cover also works |
| Featured | Include in the compact homepage selection |
| Order | Display position |
| Publish | Controls publication, independently of Project status |

Write the longer case study in the **record body**. Useful headings are Problem, What I built, How it works, Tradeoffs, What I learned, and Current limitations. These body blocks appear on the project detail page. Clicking a project card or its preview goes directly to its detail page. There is no intermediate dialog.

The homepage shows up to four featured projects; if no project is marked Featured, it uses the first four projects. `/projects` contains the full published list. Existing bundled project images/marks remain available for Merix, PlateWise, Pulse and YourTomo. A new project can use a cover immediately; a custom original logo is a separate asset/code change.

**Status and visibility are separate:** Project status = Archived describes a project; Publish = Archived hides it. Merix and PlateWise currently have inactive/paused backend services, so do not label their demos Live until those services are restored and tested. The portfolio itself does not restart another project's backend.

Avoid changing a published Slug casually: it changes the URL. If you rename one, ask for a redirect from the old URL so shared links keep working.

### Consistent project details

Project pages use five sections: **Overview & status**, **Screens & walkthrough**, **My role & ownership**, **Architecture & decisions**, and **Limitations & links**. Add these headings in the existing Notion project page body, then put your original details below each. No new database properties or code update is required. Existing About the project content maps to Overview; Current service note maps to Limitations. Unrecognized headings and blocks are preserved, rather than discarded. The Project status property supplies the status badge; Image/cover supplies the preview; Live URL and Source URL supply the public links.

Missing ownership or architecture information stays explicitly undocumented until you provide it. Do not publish a generic template as if it describes your actual work. In Merix, add your specific responsibilities, system structure and the decisions you can explain; the existing paused-backend note is retained.

## 7. Work, experience and achievements

Use **Work & highlights** for both kinds of entry.

For a job, internship, campus role, freelance engagement or open-source programme, set **Kind = Experience**. Fill Name (role), Organization, Start, End, Current, Category, Summary and Source. Current = checked displays Present. Use the real dates you can substantiate; the design shows a month/year rather than implying a more precise public start day.

The **Summary property** supplies the expanded dropdown details. The page body is not rendered as a separate public work article. Write the important information in Summary.

For a scholarship, award, selection, event milestone or other achievement, set **Kind = Highlight**. Name is the achievement text; Category is its small context label; Source is the evidence link. Highlights stay on the homepage behind Show all/Show less. There is no separate Achievements page. Two GitHub activity highlights are generated automatically in addition to your manually maintained highlights.

Keep claims concrete: selection, finalist, participant and winner mean different things. Do not publish another person's reference-site achievements.

## 8. Tech stack and tools

Open **Tech stack & tools**. Set Name, Icon key, Website, Category, Order and Publish. Visitors see compact icons; hovering/focusing shows the name/category.

Supported icon keys:

`javascript`, `cplusplus`, `typescript`, `python`, `react`, `nextdotjs`, `tailwindcss`, `fastapi`, `supabase`, `postgresql`, `nodejs`, `express`, `mongodb`, `socketio`, `langchain`, `astro`, `githubactions`, `git`, `github`, `notion`, `vercel`.

Use the exact key. An unknown key is omitted rather than displaying a broken image. Adding a completely new technology requires adding a licensed icon and a code mapping first. Adding a row for an already supported key needs no deployment. Avoid duplicate icon keys. Publish technologies you can discuss honestly, rather than every dependency ever found in a repository.

## 9. Publishing your own writing

Use **Writing** for articles you wrote. Use Personal Library for articles written by other people that you recommend.

1. Add Name, a unique Slug and a short Summary.
2. Set the Published date property, Tags, and an optional Cover.
3. Write the full article in the record body, using native Notion blocks.
4. Set Comments if you want a discussion beneath this article. Signed-in messages publish immediately; owner removal/pinning remains available.
5. Set Featured if it should be included in the compact homepage list.
6. Review the complete draft, then set Publish = Published.
7. Check `/writing` and `/writing/your-slug`, including headings, links, images and mobile reading.

The homepage shows up to three featured articles, or the latest three when none are featured. The archive shows all published articles. Published body text enters the site's search index, subject to the documented bounded indexing limit.

**Images and covers:** you can upload images directly from your computer into the Notion article body; Google Drive and a separately hosted URL are not required. A first body image works as the website article banner. Notion's top-of-page Add cover decorates the Notion page, and the Cover property stores optional cover metadata; the current text-only Writing list and article header do not automatically display either as a banner. For the ten imported Hashnode articles, each available cover was also copied into the body, and all cover/inline images were uploaded into Notion. Edit or replace those native image blocks directly.

The imported articles retain their original publication dates and Hashnode Canonical URL values. Their dates are not reset to the import date. The untouched Draft starter remains available to duplicate for your next article. A worked example was added to the private Notion quick-start guide, using DNS Record Types Explained.

Supported body blocks: paragraphs, headings, bulleted/numbered lists, quotes, callouts, code, images, tables and toggles. Avoid relying on arbitrary embeds, raw HTML, scripts, private synced blocks or child-page content. Unsupported blocks do not become executable website content.

### Medium and Substack

Publishing in Notion publishes to this website; it does not automatically publish to Medium or Substack. A practical workflow is to publish the original on your website, then use Medium's import/canonical tools for a manual cross-post. Store a Medium URL for reference if appropriate. Set Canonical only when another URL should genuinely be treated as the original. A canonical link is an indexing hint, not a guarantee of ranking or indexing.

Changing the website's layout, adding a newsletter integration or automatically posting to another service is separate development work.

## 10. Off the Clock: books, articles, watchlist and channels

Use **Personal Library** for these four shelves. Each record has Name, Shelf, Format, Progress, Creator, Summary, Link, Image, Finished date, Order and Publish.

| What you are adding | Shelf | Typical Format |
| --- | --- | --- |
| A book | Books | Book |
| Someone else's essay/article | Articles | Article |
| A research paper | Papers | Research paper |
| A film | Watchlist | Movie |
| A series | Watchlist | Series |
| An anime | Watchlist | Anime |
| One video | Watchlist | YouTube video |
| A creator/channel you follow | Channels | YouTube channel, Instagram creator, Discord community or Other |

Books appear at `/books`; Articles and Papers share `/articles`; entertainment appears at `/watchlist`; creators and communities appear at `/channels`. Their covers can also feed the homepage collage. Empty shelves remain honestly empty rather than inventing your recommendations.

**Progress options** include Want to read, Reading, Read, Want to watch, Watching, Watched and Following. Use the option that matches the item. Creator can hold an author, filmmaker, channel owner or publisher. Summary should explain why you chose it or what you took from it. Link points to an official/public source; it is not a file-upload field.

For a book: fill title, author in Creator, Books/Book, reading progress, a cover and a few personal sentences. For a paper: use Papers/Research paper and link the publisher, arXiv or another legitimate public source. For a channel: use Channels, the matching Format and Following.

Do not place personal invite-only Discord links, private Instagram content or access-controlled files on a public shelf unless you intend to disclose them. A cover is an image, not permission to redistribute the book/movie itself.

## 11. Places

Use **Places**. Fill Name, Country, Travel status, Summary, optional Visited date, Image, Map, Order and Publish. Travel status is **Visited** or **Want to go**. These are separate groupings on `/places`.

Put your note in Summary. The record body is not a public place-detail article. Map is a public map link; it does not need to reveal your exact home, current location or travel booking. A supported image can feed the homepage places tile.

## 12. Friends

Use **Friends**. Fill Name and Website, with optional Avatar and Summary. Set Order and Published. Include only people you choose to feature; design references are not automatically your friends.

The footer creates the friend links and enables its previous/next navigation once published friends exist. A separate webring is not required. Its current previous/next controls point to the last/first entries in your displayed list; this is not a globally coordinated ring spanning other people's sites.

## 13. Résumé

You must provide the actual document; no résumé has been fabricated for you.

Recommended: upload a real PDF to a stable public HTTPS location, test that it opens when signed out, and set **Profile → Resume PDF**. Other supported options are a server RESUME_URL variable or `public/resume.pdf` in the code repository.

Do not use a private Drive/Notion editing link that requires your account. Remove private information you do not want public before uploading. Updating a URL/content record uses the content cache; replacing a file under `public/` requires a deployment. `/resume` remains a useful page with your verified work links until a PDF is supplied.

## 14. Covers, image hosts and broken pictures

Use an Image/Cover/Photo/Avatar URL property as appropriate. A native **Add cover → Upload** Notion page cover is supported for card/shelf images when Notion returns a supported file URL. An explicit Image property takes precedence over the page cover.

Allowed image hosts are `github.com`, `avatars.githubusercontent.com`, `prod-files-secure.s3.us-west-2.amazonaws.com`, `s3.us-west-2.amazonaws.com`, and `images.unsplash.com`. Ordinary links may use other valid public HTTPS destinations; image hosts have a narrower allowlist. A new image host needs a deliberate code/CSP update, not a private token pasted into a URL.

For a broken cover, check: is it a direct image link, is the host supported, can a signed-out browser open it, has a temporary Notion URL expired, and is the record Published? Re-upload/reselect a native cover to refresh it when needed. Keep originals in your own backup. A missing cover does not mean the whole record must be deleted.

Use appropriately sized images, usually under a few hundred kilobytes. Avoid uploading huge original camera files for a tiny avatar. Keep font/icon license files in the repository when changing assets.

## 15. Guestbook and article comments

Visitors sign in with Google, enter a display name and message, and post it immediately. Basic Google identity/email/profile is used for login; Gmail/Drive access is not requested. Public pages display the chosen display name, message and date, not the Google email address.

New submissions publish immediately; there is no approval queue for ordinary comments. Authors can delete their own messages. Messages are limited to three submissions per user per ten minutes. Deleting a submission does not reset this quota.

### Moderation steps

1. Open the portfolio Supabase project, not Merix or Pulse.
2. Go to Table Editor and open `guestbook_messages`.
3. Review the `message`, `display_name`, `created_at` and `article_slug` fields.
4. New posts already have `status = approved`. Set it to `rejected` to hide spam or an unwanted comment; restore `approved` to show it again.
5. Check the relevant page after its short public-message cache refresh (about one minute).

**Pin a comment:** in the same `guestbook_messages` table, set its `status` to `approved` and its `pinned` checkbox to `true`, then save the row. Pinned messages sort before other approved messages and show a Pinned label. Several pins are allowed; the newest pinned message comes first. Set `pinned` back to `false` to unpin. Pinning a pending/rejected message does not publish it. The same control works for article discussions. Visitors cannot change moderation status or pin their own messages. Allow about one minute for the public cache to refresh, then reload the page.

After posting, the author immediately sees a public-post confirmation and the comment in the public list. Posts and author deletions expire the public message cache immediately. The public list contains approved messages only. Sign in using the same Google account to see that account's submissions. A successful post does not require typing it again.

`article_slug = null` means the general guestbook. A slug means an article discussion. The homepage previews up to three approved guestbook messages; `/guestbook` shows the larger list. Article Comments controls whether a published article accepts discussion.

Do not change the author's `user_id` or manually grant moderation rights to ordinary visitors. Supabase dashboard access is an owner privilege. Rejected messages remain private to their author/owner; delete only when you intend to remove them. There are no built-in automatic email notifications or a separate custom moderation dashboard.

## 16. GitHub and coding statistics

The homepage shows three combined figures: platform solves, rated contests and known best streak. Solves are added across platforms and may overlap; the streak is based on available accepted-solution history, not a claim of complete lifetime history. Unavailable platform totals are explicitly marked partial. Open **Explore activity** from that section or the search dock for individual platform tabs, source dates, streaks and contest history. Upstream PRs appear before the GitHub calendar so visitors can inspect concrete contributions first.

GitHub contributions, merged/open/closed authored pull requests, peer-reviewed pull requests, and coding profiles are fetched automatically on the server. Activity reads are normally cached about one hour. GitHub profile metadata/photo fallback uses a shorter five-minute cache. You do not need to paste totals into Notion each day.

Public handles: GitHub/LeetCode `knowprasad`, Codeforces/CodeChef `prsdx`. Changing a coding handle is currently a code update in the source profile/activity configuration, not a CMS field.

The calendar is a public contribution window; a different GitHub year selection or activity visible only to your signed-in account can differ. Upstream failures can show a dated saved snapshot. Read its source/date label before interpreting it as live data. GitHub's public APIs also have request limits.

Platform solves are added across services and may include overlapping problems; they are not claimed to be unique across the internet. Accepted solutions on the same India-calendar day count as one active day for the combined streak. Failed submissions do not extend a streak. Historical streak totals are limited by the providers' available accepted-submission history. Each provider's history source/date is listed. If one is using a saved snapshot, the current streak is marked unverified rather than presenting a stale zero as confirmed inactivity. CodeChef recent-page history is labeled partial when appropriate.

The visitor counter is an approximate browser count since launch, not a verified unique-person count. Different devices, cleared cookies and some automated traffic can affect it. No raw IP address is stored by this counter.

## 17. Contact, booking, theme and sound

Book a call links to your Cal.com page. Manage available times, duration and calendar connections in Cal.com. The website does not contain your calendar credentials. If you change your public booking URL, update Profile → Booking.

Email and Copy labels hide the address in the layout, but a mailto link remains publicly discoverable. The contact dock opens a draft in the visitor's email application unless a separate Formspree form has been configured. A mail draft is not a server-confirmed delivered message. Do not assume an email was sent simply because a mail application opened.

Theme and sound choices are saved in that browser. Theme offers Auto, Light and Dark in the header menu and searchable dock. New visitors start in Auto; previous Light/Dark choices remain respected. Auto uses the visitor’s local clock: morning 06:00–10:59 (peach white), day 11:00–16:59 (cool white), evening 17:00–20:59 (lavender white), night 21:00–05:59 (blue charcoal). The phase stays fixed while browsing; reload or select Auto again to reassess it. Manual Light and Dark keep the monochrome palettes. No location permission or external service is used. Sound starts off; the visitor must enable it. Browsers may restrict audio until a user gesture. Reduced-motion preferences shorten/disable nonessential animation. The circular theme transition uses browser support when available and falls back to a normal theme switch.

## 18. Search, SEO and discovery

The dock opens with its button, `/`, or Ctrl/Cmd+K. Its published-content index downloads only when search is first opened; a loading notice appears while it arrives, and later opens reuse it during that page session. It searches your published projects, writing/body text, shelves, places, friends and work/section entries. It does not search your entire private Notion workspace. An empty collection should not produce private draft search results.

The website generates canonical links, social metadata, structured data, robots and sitemap output. Substantive public pages can enter the sitemap; empty shelves/writing do not pretend to contain articles. `/llms.txt` is a machine-readable reading index. These are accessibility/discovery aids, not guaranteed search-engine or AI-chat rankings.

Your published Notion Profile name/bio and Projects feed both the visible site and its machine-readable identity/reading index. Archive a project in Notion to remove it from the public project index; do not separately edit `llms.txt`. The profile schema connects Shubham Prasad, the knowprasad handle, the website and public social accounts. Agent reading guidance includes project availability and activity-history limitations; it never exposes contact email or private drafts.

Google Search Console manages search discovery separately from deployment. The `knowprasad.me` domain property is already verified. Its submitted sitemap is `https://knowprasad.me/sitemap.xml`; Google periodically checks it for new routes. Use URL Inspection for a particular page's actual indexing status, then Test live URL to diagnose crawl access. Request indexing after a substantial change, not repeatedly for the same unchanged page. Google decides when to crawl/index and whether to show a result; a passing live test or AEO audit is not a ranking guarantee. No paid indexing service is required.

Write useful titles and summaries. Keep URLs stable and images descriptive. Avoid publishing duplicate placeholder posts to make a page look busy. Updating the social sharing image or site-wide SEO wording is a code/asset change; link previews in other apps may cache old results for hours or days.

## 19. Routine maintenance

**After a content edit:** check the public URL, the corresponding archive and a narrow phone view after cache refresh. Test its outbound links.

**Weekly, when you receive messages:** check for spam or unwanted public comments and hide them if needed. Confirm the contact and booking destinations still work.

**Monthly:** check Vercel/Supabase usage, test Google sign-in/sign-out, and back up your Notion CMS. Keep the domain renewal date and payment/contact details current in Namecheap. Domain auto-renew was not enabled as part of this work; verify your preference yourself.

**Before a code release:** use the checks in OPERATIONS.md, inspect a preview, and keep secrets out of Git. A dependency audit checks known advisories; it is not proof that an application has no vulnerabilities.

**Backups:** export the CMS from Notion periodically, keep original image/PDF assets, preserve the source repository, and use an appropriate Supabase data export for messages. Git does not back up live Notion records, database rows, account settings or Vercel secret values.

## 20. Troubleshooting

| Symptom | First checks |
| --- | --- |
| A new item is missing | Correct database; Publish = Published; name/slug valid; cache has refreshed |
| Whole section became empty | A successful CMS query may contain no Published records; publish the intended records rather than duplicating code defaults |
| Homepage misses a project/post | Featured selection and compact limit; inspect the full archive |
| Text in the Notion body is missing | Only Writing/Project bodies render fully; Profile Bio, Work Summary and shelf/place Summary are the public fields for those records |
| A tool icon is missing | Exact supported Icon key; no duplicate key; licensed asset exists |
| Photo stays old | Clear a CMS Photo override if GitHub should control it; wait for server/CDN/browser caches |
| A PDF asks for login | Use a signed-out-accessible PDF URL, not an editing/share screen |
| Statistics are older than your provider | Read source/date label; allow the activity cache; provider may be blocking/rate-limiting reads |
| Google login returns an error | Check canonical domain, Supabase allow-list, provider status and Google client callback; see OPERATIONS.md |
| A message is not public | It was hidden by the owner, article comments are disabled, or the provider request failed |
| The contact form did not deliver | The default contact action opens an email draft; check the mail client and Sent folder |
| The site is unavailable | Check Vercel deployment, domain DNS and provider status; do not change nameservers or buy hosting as a first response |

## 21. What to ask a developer to change

Ask for development help for new features, different page structures, unsupported content blocks, new icon types/image hosts, new social/provider integrations, authentication/security changes, domain changes and database schema migrations. Keep your request concrete: the public URL, what you expected, what happened, device/browser, and a screenshot without passwords/tokens.

For ordinary content updates, use the CMS workflow above. Keep credentials in the service's secure settings or ignored server environment; never place them in Notion content, a GitHub issue, a public screenshot or this handbook.


### Interface sounds

Sound is off until the visitor enables it in the header, and the preference stays on that browser. The site resumes mobile audio during a user gesture and schedules the tone only once the audio clock is running. Browser restrictions, media volume, output routing and phone silent mode may still prevent audible playback; the site does not override device settings.

### Can project pages follow a GitHub README?

README synchronization is enabled. The main project documentation comes from the public repository linked in **Projects → Source URL**. Merix, PlateWise and YourTomo are connected. Pulse currently has no published Source URL and continues using its Notion body.

1. Edit README.md in the project's default GitHub branch and commit the update there. Root files named readme.md or Readme.md are also supported.
2. The portfolio fetches the public file on the server with a 15-minute source cache. Its project page also has a five-minute cache. Allow roughly 15–20 minutes plus provider delays and traffic-triggered refreshes; no portfolio code change or deployment is normally needed.
3. Keep the project card's Name, Summary, Tags, current Project status, preview Image, Live URL and Source URL in Notion. These concise fields are not guessed from arbitrary README prose.
4. Add optional context in the Notion project's record body: ownership, architecture decisions, walkthroughs or current limitations. Recognized section headings still group those notes. Empty ownership/architecture sections are omitted when the README is available.

The **From the README** section names and links its source. It renders Markdown tables, lists, code, safe HTML and approved images. Relative files/images and section links are resolved for that repository. Executable HTML, embeds, arbitrary styles, unsafe URLs and unapproved image hosts are excluded; code examples are displayed as text and never run. Very large documents over 200 KB are rejected. Missing/unavailable documentation shows a GitHub link and keeps the Notion context usable. A repository rename requires updating Source URL; private repository READMEs are never fetched with credentials.

The site does not rewrite or independently verify README claims. Keep README descriptions current, especially demo availability; the explicit Notion Project status remains visible above the documentation. If a diagram's host is unsupported, provide an image in the repository or ask for a reviewed host addition.

## Writing presentation (26 October 2026)
Published articles automatically use the shared reader: 640px reading column, date/reading time, tags, heading links, desktop contents rail/mobile disclosure, copyable code and images that open at full size. The first body image becomes the cover above the contents; it is not rendered twice. Keep your cover as the first image block in Notion. Author captions on later images remain visible.

The homepage and Writing archive show compact title/date rows without summaries. Summary is still used on each article and in metadata. Tags filter the archive. Related articles and previous/next links derive from Published entries; no manual links to maintain. The public `view raw` link is plain text and never includes Draft records. Original Hashnode canonicals remain unchanged. There are no invented article views or like totals.

## Project groups and homepage selection
Open Portfolio CMS → Projects. `Collection` has two choices: **Current projects** for substantial work, including work in progress, and **Side quests** for smaller experiments/tools. `Featured` selects homepage cards only from Current projects. A Side quest stays off the homepage even if Featured is checked. Uncheck Featured to keep a project on the full archive without presenting it as selected work. `Order` controls order; `Project status` describes progress separately. `Publish` still controls whether the record is public at all.

Initial selection: Merix and PlateWise are featured Current projects. Pulse is Current projects / Building and is not featured while it is being developed. YourTomo is a Side quest. To feature Pulse later, check Featured after preparing its screenshot and description; no code change is needed. Existing project detail pages and GitHub README fetching continue to work for both groups. No empty Past section is shown.

## Off the Clock: covers, filters and homepage previews

**Your own diary notes:** every Personal library and Places record has a **My take** property for the short card excerpt. Cards show only up to three lines directly beneath the image and title/status; clicking anywhere on the card opens the full diary page. If My take is blank, the card uses Summary instead. Open the actual Notion entry page and write the full note in its body: paragraphs, headings, quotes, lists, code and captioned images are supported. This body becomes public on the diary page when Publish is Published; the gallery returns only its images/captions. The View photos button on the diary page opens the photo gallery. Summary remains a separate short description. You can also put a longer plain-text take in the property; its full text is shown on the diary page, while the card stays clipped. Leave notes blank when you have nothing to add; the site never generates your opinions.

**Stable note URLs:** fill Slug with a short unique lowercase name, such as atomic-habits, before publishing. Existing entries already have slugs. Keep it unchanged after sharing; changing a title does not change the slug. If Slug is blank or invalid, the entry uses its stable Notion ID. Entry IDs continue to work as an alias even after adding a slug. Notes appear in the sitemap; dock search indexes their title, Summary and My take excerpt without loading every full body on the homepage.

**Automatic artwork:** when Image and the Notion page cover are both empty, the server tries a matching image. Books use title + Creator through Open Library; movies/series/anime and places use matching Wikipedia entries and image attribution. Articles and channels read public preview metadata from supported sources: Substack, Medium, Dev.to, Hashnode, YouTube, Instagram and GitHub. A public Link is required for articles/channels. Login walls, unsupported publishers, ambiguous names, missing covers or provider failures keep the placeholder; use Image to choose a reliable alternative. This uses public endpoints without paid accounts or API keys. Lookups are cached for 24 hours and do not run on search/filter clicks. An explicit Image or page cover always overrides automatic matching immediately after the ordinary content cache refresh. Automatic results display source/credit and do not write over your Notion properties. Book covers follow Open Library's public image URLs; other imported starter artwork is kept as compact local WebP. No service guarantees every title or channel will match.

Use **Portfolio CMS → Personal library** for books, saved articles/papers, movies, series, anime, videos and channels. Use **Places** for travel. These are the public publishing copies; the original private Movies & Series Tracker and Substack likes are not continuously synchronized.

1. Create an entry and choose **Shelf**. Books must have **Shelf = Books** and **Format = Book**. Articles and research papers use Articles/Papers; entertainment uses Watchlist; creators and communities use Channels.
2. Set **Progress**: Reading / Read / Want to read for books and articles; Watching / Watched / Want to watch for entertainment; Following for channels. A blank progress value stays under On the shelf rather than claiming you finished it. Format supplies the watchlist and channel filters.
3. Add an **Image** URL, or upload a normal Notion page cover. The explicit Image property wins over the page cover. Supported image hosts are your own knowprasad.me, images.unsplash.com, GitHub/avatar URLs and the supported Notion storage hosts. A Google Drive sharing page is not an image URL. Keep portrait covers/posters for books/watchlist, landscape photos for places/articles, and square logos for channels. Missing or failed images show a text/icon placeholder.
4. **Image credit** is visible under the card; **Image source** links to its attribution or original publisher. The starter travel photos are representative Wikimedia images, not your personal photos. Replace them with your own photos and update credit/source together. Local imported images are optimized WebP files under public/collection-images; their origins are documented in docs/COLLECTION-IMAGE-SOURCES.md.
5. Use **Featured** and **Order** to choose homepage artwork. The site considers featured images first in Order, then other available images: four book covers, two watchlist posters, three article previews, one place photo and up to three channel icons. Entries without images do not consume those slots. Every Published entry still appears on its collection page regardless of Featured.
6. For Places, set **Travel status = Visited / Want to go**, Country and optional Map URL. Leave the visit date blank when unknown. Your status creates the filter; it is separate from whether a photo is your own.
7. Set **Publish = Published**. Search/filtering is local in the browser and immediate; content changes refresh through the existing request-driven five-minute Notion cache. Clear filters to recover an empty search. No redeployment is required for routine edits.

**Multiple photos and captions:** open the actual entry page in Notion (for example Places → Banaras). Insert image blocks in its body, using `/image` to upload or paste a supported image URL. Click below each image and add a caption. Visitors first open the diary page by clicking its card, then use View photos; the main Image/cover appears first, followed by body images in order, with captions, thumbnails and previous/next controls. Nested supported blocks work too. Galleries show up to 30 distinct body images. Only image blocks/captions are returned; ordinary body paragraphs are not published by this gallery. No extra fields or code changes are required. This works for every collection, including watchlist and articles. Extra images are fetched only when a gallery opens and cached on the server for five minutes. Failed loads retain the main image and offer Retry. Banaras includes two clearly labelled representative sample photos; replace them with your own when ready.

The starter import contains three books, five favourite watchlist entries, five places and nine linked Substack articles. Add your own channel picks later; an empty channel shelf does not invent recommendations.

The homepage bookshelf shows up to **four upright books on a shelf**. Each book opens its own diary page directly; the Bookshelf caption opens the full grid. Feature and order the cover images to select the books. Full notes are not prefetched merely because their links appear on the homepage. The rest of the Off the Clock collage keeps its existing layout.

## Portfolio-service inquiries

The service mention is a small email inquiry at the end of the footer, anchored at #build-portfolio. There is no hero promotion, standalone sales section or public pricing on the portfolio. Edit its copy in src/components/portfolio-service.tsx only after owner approval; Notion profile edits do not change it. Pricing and the public LinkedIn Services listing are separate, so this website-only change does not alter the agreed package rates or LinkedIn description.

The link opens the visitor’s email app with an inquiry outline; it does not submit a database form. No payment processor, lead database or new analytics integration was added. Business documents and the local launch-post draft are under C:/PROJECTS/Templates/Portfolio Website/docs. Starter development is paused pending demand validation, and publishing/scheduling the LinkedIn launch post is explicitly prohibited.

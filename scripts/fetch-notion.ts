import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// --- Config ---
const NOTION_TOKEN = process.env.NOTION_TOKEN?.trim();
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID?.trim();

// Property name overrides (case-sensitive for Notion API filters).
// Set these to match the exact names in your Notion database.
// The Getters below use these values with case-insensitive matching.
const PROP_PUBLISHED = process.env.NOTION_PROP_PUBLISHED?.trim() || "published";
const PROP_DATE = process.env.NOTION_PROP_DATE?.trim() || "post date";
const PROP_TITLE = process.env.NOTION_PROP_TITLE?.trim() || "Name"; // fallback to "Title" too
const PROP_SLUG = process.env.NOTION_PROP_SLUG?.trim() || "Slug";
const PROP_EXCERPT = process.env.NOTION_PROP_EXCERPT?.trim() || "Excerpt";
const PROP_TAGS = process.env.NOTION_PROP_TAGS?.trim() || "Tags";

function getErrorDetails(err: unknown): {
  status?: number;
  code?: string;
  message: string;
} {
  if (err instanceof Error) {
    const apiError = err as Error & {
      status?: number;
      code?: string;
      body?: { code?: string; message?: string };
    };
    return {
      status: apiError.status,
      code: apiError.code ?? apiError.body?.code,
      message: apiError.body?.message ?? apiError.message,
    };
  }

  return { message: String(err) };
}

function formatError(err: unknown): string {
  const details = getErrorDetails(err);
  const prefix = [
    details.status ? `HTTP ${details.status}` : null,
    details.code ?? null,
  ]
    .filter(Boolean)
    .join(" ");

  return prefix ? `${prefix}: ${details.message}` : details.message;
}

function isNotFoundError(err: unknown): boolean {
  const details = getErrorDetails(err);
  return details.status === 404 || details.code === "object_not_found";
}

function getConfig(): { token: string; databaseId: string } {
  const token = NOTION_TOKEN;
  const databaseId = NOTION_DATABASE_ID;
  const missing = [
    !token ? "NOTION_TOKEN" : null,
    !databaseId ? "NOTION_DATABASE_ID" : null,
  ].filter((name): name is string => Boolean(name));

  if (missing.length > 0) {
    throw new Error(
      `Configuration error: missing ${missing.join(" and ")}. Set the required environment variable(s) before running the Notion sync.`,
    );
  }

  return { token: token!, databaseId: databaseId! };
}

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const BLOG_DIR = join(__dirname, "..", "src", "content", "blog");

// --- Notion client setup ---
let notion: Client;
let n2m: NotionToMarkdown;

// --- Types ---
interface NotionProperties {
  [key: string]: {
    type: string;
    title?: Array<{ plain_text: string }>;
    rich_text?: Array<{ plain_text: string }>;
    multi_select?: Array<{ name: string }>;
    checkbox?: boolean;
    date?: { start: string } | null;
  };
}

// --- Property helpers (case-insensitive name + type matching) ---

function findProp(props: NotionProperties, name: string, expectedType: string) {
  const lower = name.toLowerCase();
  for (const [key, prop] of Object.entries(props)) {
    if (key.toLowerCase() === lower && prop.type === expectedType) return prop;
  }
  return null;
}

function getText(props: NotionProperties, name: string): string {
  const prop = findProp(props, name, "title") ?? findProp(props, name, "rich_text");
  if (!prop) return "";
  if (prop.title?.[0]?.plain_text) return prop.title[0].plain_text;
  if (prop.rich_text?.[0]?.plain_text) return prop.rich_text[0].plain_text;
  return "";
}

function getDate(props: NotionProperties, name: string): string | null {
  const prop = findProp(props, name, "date");
  const start = prop?.date?.start;
  if (!start) return null;
  return start.split("T")[0]!;
}

function getMultiSelect(props: NotionProperties, name: string): string[] {
  const prop = findProp(props, name, "multi_select");
  return prop?.multi_select?.map((item) => item.name) ?? [];
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex").slice(0, 12);
}
function buildMdx(
  title: string,
  date: string,
  excerpt: string,
  tags: string[],
  body: string,
): string {
  const tagsStr =
    tags.length > 0
      ? `[${tags.map(yamlString).join(", ")}]`
      : "[]";

  return `---
title: ${yamlString(title)}
date: ${date}
tags: ${tagsStr}
excerpt: ${yamlString(excerpt)}
draft: false
---

${body.trim()}
`;
}
async function resolveDataSourceId(databaseId: string): Promise<string> {
  console.log("🔍 Resolving Notion database...");

  try {
    const db = await notion.databases.retrieve({ database_id: databaseId });
    const dataSources = (
      db as { data_sources?: Array<{ id?: string }> }
    ).data_sources;
    const dataSourceId = dataSources?.find((source) => source.id)?.id;

    if (dataSourceId) {
      console.log("   Found a data source for the database.");
      return dataSourceId;
    }

    console.log("   No data source was listed; using the configured ID directly.");
    return databaseId;
  } catch (err) {
    if (isNotFoundError(err)) {
      console.log("   ID is not exposed as a database; trying it as a data source ID.");
      return databaseId;
    }

    throw new Error(`Unable to retrieve the configured Notion database: ${formatError(err)}`);
  }
}

async function queryPublishedPages(dataSourceId: string) {
  const pages: Array<{ id: string; properties: NotionProperties }> = [];
  let startCursor: string | undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        property: PROP_PUBLISHED,
        checkbox: { equals: true },
      },
      sorts: [{ property: PROP_DATE, direction: "descending" }],
      ...(startCursor ? { start_cursor: startCursor } : {}),
    });

    pages.push(
      ...(response.results as Array<{ id: string; properties: NotionProperties }>),
    );
    startCursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (startCursor);

  return pages;
}

// --- Main ---
async function main() {
  const { token, databaseId } = getConfig();
  notion = new Client({ auth: token });
  n2m = new NotionToMarkdown({ notionClient: notion });
  await mkdir(BLOG_DIR, { recursive: true });

  // 1. Resolve data source ID and query all published pages.
  const dataSourceId = await resolveDataSourceId(databaseId);
  console.log("🔍 Querying published pages...");
  let pages: Array<{ id: string; properties: NotionProperties }>;
  try {
    pages = await queryPublishedPages(dataSourceId);
  } catch (err) {
    throw new Error(
      `Unable to query published Notion pages. Check database access and property names (${PROP_PUBLISHED}, ${PROP_DATE}): ${formatError(err)}`,
    );
  }
  console.log(`   Found ${pages.length} published page(s).\n`);

  let newCount = 0;
  let updatedCount = 0;
  let unchangedCount = 0;
  let skippedCount = 0;

  // 2. Process each page
  for (const page of pages) {
    const props = page.properties as NotionProperties;

    const title = getText(props, PROP_TITLE) || getText(props, "Title");
    let slug = getText(props, PROP_SLUG);
    const excerpt = getText(props, PROP_EXCERPT);
    const tags = getMultiSelect(props, PROP_TAGS);
    const date = getDate(props, PROP_DATE);

    // Validate required fields
    if (!title) {
      console.warn(`   ⚠  SKIP page ${page.id}: missing title`);
      skippedCount++;
      continue;
    }
    if (!date) {
      console.warn(`   ⚠  SKIP "${title}": missing date property`);
      skippedCount++;
      continue;
    }
    if (!slug) {
      slug = slugify(title);
      console.log(`   ℹ  "${title}" — no slug set, generated: "${slug}"`);
    }
    slug = slugify(slug);
    if (!slug) {
      console.warn(`   ⚠  SKIP "${title}": slug is empty after normalization`);
      skippedCount++;
      continue;
    }

    console.log(`   📄 "${title}" → ${slug}.mdx`);

    // Convert Notion blocks to markdown
    let mdBody: string;
    try {
      const mdBlocks = await n2m.pageToMarkdown(page.id);
      const result = n2m.toMarkdownString(mdBlocks);
      // notion-to-md v3 returns { parent: string } when separateChildPage is false
      mdBody =
        typeof result === "object" && result !== null && "parent" in result
          ? (result as { parent: string }).parent
          : String(result);
    } catch (err) {
      console.error(
        `   ❌ ERROR converting "${title}":`,
        err instanceof Error ? err.message : err,
      );
      skippedCount++;
      continue;
    }

    if (!mdBody.trim()) {
      console.warn(`   ⚠  SKIP "${title}": empty body after conversion`);
      skippedCount++;
      continue;
    }

    // Build MDX file content
    const mdxContent = buildMdx(title, date, excerpt || title, tags, mdBody);
    const filePath = join(BLOG_DIR, `${slug}.mdx`);
    const newHash = hashContent(mdxContent);

    // Compare with existing file (hash-based change detection)
    if (existsSync(filePath)) {
      const existing = await readFile(filePath, "utf-8");
      if (hashContent(existing) === newHash) {
        console.log(`      ⏭  unchanged`);
        unchangedCount++;
        continue;
      }
      console.log(`      ✏  updated`);
      updatedCount++;
    } else {
      console.log(`      ✨ new`);
      newCount++;
    }

    await writeFile(filePath, mdxContent, "utf-8");
  }

  // 3. Print summary
  console.log(`\n---`);
  console.log(`   ✨ New:       ${newCount}`);
  console.log(`   ✏  Updated:   ${updatedCount}`);
  console.log(`   ⏭  Unchanged: ${unchangedCount}`);
  console.log(`   ⚠  Skipped:   ${skippedCount}`);
  console.log(`   📁 Output:    ${BLOG_DIR}`);
}

main().catch((err) => {
  console.error(`\n❌ FATAL: ${formatError(err)}`);
  process.exit(1);
});

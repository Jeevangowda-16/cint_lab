import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://aero.iisc.ac.in/wp-json/tribe/events/v1/events";
const OUTPUT_PATH = path.resolve(process.cwd(), "scripts", "events-data.json");

function decodeHtmlEntities(value) {
  if (!value) {
    return "";
  }

  const named = value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&#038;", "&")
    .replaceAll("&#8211;", "-")
    .replaceAll("&#8212;", "-")
    .replaceAll("&#8216;", "'")
    .replaceAll("&#8217;", "'")
    .replaceAll("&#8220;", '"')
    .replaceAll("&#8221;", '"')
    .replaceAll("&#x2013;", "-")
    .replaceAll("&#x2014;", "-")
    .replaceAll("&nbsp;", " ");

  return named.replace(/&#(\d+);/g, (match, code) => {
    const numeric = Number.parseInt(code, 10);
    if (Number.isNaN(numeric)) {
      return match;
    }
    return String.fromCodePoint(numeric);
  });
}

function stripHtml(value) {
  const noTags = value.replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]*>/g, " ");
  const decoded = decodeHtmlEntities(noTags);
  return decoded.replace(/\s+/g, " ").trim();
}

function parseUtcDate(value) {
  if (!value) {
    return "";
  }

  const normalized = value.replace(" ", "T");
  return `${normalized}.000Z`;
}

function inferType(title) {
  const value = title.toLowerCase();

  if (
    value.includes("workshop") ||
    value.includes("short course") ||
    value.includes("symposium") ||
    value.includes("open day") ||
    value.includes("aeres")
  ) {
    return "event";
  }

  return "seminar";
}

function toBaseId(slug, title) {
  if (slug && slug.trim()) {
    return slug.trim().toLowerCase();
  }

  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 110);
}

function withSuffix(baseId, index) {
  if (index <= 1) {
    return baseId;
  }

  const suffix = `-${index}`;
  const maxBaseLength = 110 - suffix.length;
  const safeBase = baseId.slice(0, Math.max(1, maxBaseLength));
  return `${safeBase}${suffix}`;
}

function resolveUniqueId(baseId, seenIds) {
  let index = 1;
  let candidate = withSuffix(baseId, index);

  while (seenIds.has(candidate)) {
    index += 1;
    candidate = withSuffix(baseId, index);
  }

  seenIds.add(candidate);
  return candidate;
}

async function fetchPage(page) {
  const params = new URLSearchParams({
    page: String(page),
    per_page: "50",
    start_date: "2020-01-01 00:00:00",
    end_date: "2030-12-31 23:59:59",
    status: "publish",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed page ${page}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchAllEvents() {
  const first = await fetchPage(1);
  const totalPages = first.total_pages || 1;
  const all = [...(first.events || [])];

  for (let page = 2; page <= totalPages; page += 1) {
    const payload = await fetchPage(page);
    all.push(...(payload.events || []));
  }

  return all;
}

function mapEvent(item, seenIds) {
  const title = decodeHtmlEntities((item.title || "").trim());
  const description = stripHtml(item.description || "");
  const baseId = toBaseId(item.slug || "", title);
  const id = resolveUniqueId(baseId, seenIds);

  return {
    id,
    title,
    type: inferType(title),
    description,
    speaker: "",
    location: item?.venue?.venue || "IISc Aerospace Engineering",
    eventDate: parseUtcDate(item.utc_start_date || item.start_date),
    eventEndDate: parseUtcDate(item.utc_end_date || item.end_date),
    registrationUrl: item.url || "",
    isFeatured: Boolean(item.featured),
  };
}

async function run() {
  const rawEvents = await fetchAllEvents();
  const seenIds = new Set();

  const mapped = rawEvents
    .map((item) => mapEvent(item, seenIds))
    .filter((item) => item.title && item.eventDate);

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(mapped, null, 2)}\n`, "utf8");

  console.log(`Fetched ${rawEvents.length} events from API.`);
  console.log(`Wrote ${mapped.length} normalized events to scripts/events-data.json`);
}

run().catch((error) => {
  console.error("Sync failed:", error.message || error);
  process.exit(1);
});

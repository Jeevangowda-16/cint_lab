import fs from "node:fs/promises";

const DATA_PATH = new URL("../src/data/data.json", import.meta.url);
const EVENTS_API = "https://aero.iisc.ac.in/wp-json/tribe/events/v1/events";

function normalizeEventUrl(value) {
  if (!value) {
    return "";
  }

  try {
    const parsed = new URL(value);
    return `${parsed.origin}${parsed.pathname}`.replace(/\/+$/, "");
  } catch {
    return String(value).replace(/\/+$/, "");
  }
}

function toSlugFromUrl(url) {
  const normalized = normalizeEventUrl(url);
  const segments = normalized.split("/").filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] : "";
}

async function fetchApiEvents() {
  const events = [];
  let page = 1;

  while (true) {
    const params = new URLSearchParams({
      page: String(page),
      per_page: "50",
      start_date: "2020-01-01 00:00:00",
      end_date: "2030-12-31 23:59:59",
      status: "publish",
    });

    const response = await fetch(`${EVENTS_API}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch events API page ${page}: ${response.status}`);
    }

    const payload = await response.json();
    const pageEvents = Array.isArray(payload.events) ? payload.events : [];
    if (pageEvents.length === 0) {
      break;
    }

    events.push(...pageEvents);

    const totalPages = Number(payload.total_pages || payload.totalPages || 0);
    if (totalPages > 0 && page >= totalPages) {
      break;
    }

    page += 1;
  }

  return events;
}

async function main() {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const data = JSON.parse(raw);
  const events = Array.isArray(data.events) ? data.events : [];

  const apiEvents = await fetchApiEvents();
  const imageByKey = new Map();

  for (const apiEvent of apiEvents) {
    const imageUrl = apiEvent?.image?.url || "";
    if (!imageUrl) {
      continue;
    }

    const apiUrl = apiEvent?.url || "";
    const normalizedApiUrl = normalizeEventUrl(apiUrl);
    if (normalizedApiUrl) {
      imageByKey.set(normalizedApiUrl, imageUrl);
    }

    const slug = apiEvent?.slug || toSlugFromUrl(apiUrl);
    if (slug) {
      imageByKey.set(slug, imageUrl);
    }
  }

  let updated = 0;
  let missing = 0;

  for (const eventItem of events) {
    const normalizedRegistrationUrl = normalizeEventUrl(eventItem.registrationUrl);
    const slug = eventItem.id || toSlugFromUrl(eventItem.registrationUrl);
    const imageUrl = imageByKey.get(normalizedRegistrationUrl) || imageByKey.get(slug) || "";

    if (imageUrl) {
      eventItem.imageUrl = imageUrl;
      updated += 1;
    } else {
      eventItem.imageUrl = "";
      missing += 1;
    }
  }

  await fs.writeFile(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");

  console.log(`Processed ${events.length} events`);
  console.log(`Updated image URLs: ${updated}`);
  console.log(`Missing image URLs: ${missing}`);
}

await main();

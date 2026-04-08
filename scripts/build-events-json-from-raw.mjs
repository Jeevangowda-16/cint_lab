import fs from "node:fs";
import path from "node:path";

const rawPath = path.resolve(process.cwd(), "scripts", "events-raw.txt");
const outputPath = path.resolve(process.cwd(), "scripts", "events-data.json");

if (!fs.existsSync(rawPath)) {
  console.error("scripts/events-raw.txt not found.");
  process.exit(1);
}

const rawText = fs.readFileSync(rawPath, "utf8");

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
    .replaceAll("&#8216;", "'")
    .replaceAll("&#8217;", "'")
    .replaceAll("&#8220;", '"')
    .replaceAll("&#8221;", '"')
    .replaceAll("&#x2013;", "-")
    .replaceAll("&#x2014;", "-");

  return named.replace(/&#(\d+);/g, (_, code) => {
    const valueInt = Number.parseInt(code, 10);
    if (Number.isNaN(valueInt)) {
      return _;
    }
    return String.fromCodePoint(valueInt);
  });
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function cleanTitle(value) {
  const decoded = decodeHtmlEntities(value);
  return normalizeWhitespace(decoded.replace(/^"+|"+$/g, ""));
}

function inferType(title) {
  const value = title.toLowerCase();

  if (value.includes("workshop") || value.includes("short course") || value.includes("symposium") || value.includes("open day") || value.includes("aeres")) {
    return "event";
  }

  if (value.includes("seminar")) {
    return "seminar";
  }

  if (value.includes("defense") || value.includes("colloquium") || value.includes("ph.d") || value.includes("phd") || value.includes("mtech")) {
    return "seminar";
  }

  return "seminar";
}

function parseDatePart(part) {
  const match = part.trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid datetime format: ${part}`);
  }

  const [, year, month, day, hour, minute, second] = match;
  return {
    year: Number.parseInt(year, 10),
    month: Number.parseInt(month, 10),
    day: Number.parseInt(day, 10),
    hour: Number.parseInt(hour, 10),
    minute: Number.parseInt(minute, 10),
    second: Number.parseInt(second, 10),
  };
}

function toIsoUtc(parts) {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)).toISOString();
}

function parseDateRange(dateLine) {
  const [left, right] = dateLine.split(" - ").map((v) => v.trim());
  if (!left || !right) {
    throw new Error(`Invalid date range: ${dateLine}`);
  }

  const start = parseDatePart(left);
  let end;

  if (/^\d{2}:\d{2}:\d{2}$/.test(right)) {
    end = {
      year: start.year,
      month: start.month,
      day: start.day,
      hour: Number.parseInt(right.slice(0, 2), 10),
      minute: Number.parseInt(right.slice(3, 5), 10),
      second: Number.parseInt(right.slice(6, 8), 10),
    };
  } else {
    end = parseDatePart(right);
  }

  return {
    eventDate: toIsoUtc(start),
    eventEndDate: toIsoUtc(end),
  };
}

function toBaseId(title) {
  const safeTitle = decodeHtmlEntities(title);
  return safeTitle
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
  const safeBase = baseId.slice(0, Math.max(1, 110 - suffix.length));
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

function parseBlocks(content) {
  const sections = content.split(/\n\s*Title:\s*/g);
  const blocks = sections.slice(1).map((section) => `Title: ${section.trim()}`);
  return blocks.filter(Boolean);
}

function parseBlock(block) {
  const lines = block.split(/\r?\n/);

  const titleLine = lines.find((line) => line.startsWith("Title:"));
  const dateLine = lines.find((line) => line.startsWith("Date:"));
  const linkLine = lines.find((line) => line.startsWith("Link:"));

  if (!titleLine || !dateLine || !linkLine) {
    throw new Error(`Block missing required fields: ${block.slice(0, 120)}...`);
  }

  const title = cleanTitle(titleLine.replace("Title:", "").trim());
  const dateRaw = normalizeWhitespace(decodeHtmlEntities(dateLine.replace("Date:", "").trim()));
  const link = normalizeWhitespace(linkLine.replace("Link:", "").trim());

  const descriptionStart = lines.findIndex((line) => line.startsWith("Description:"));
  const linkIndex = lines.findIndex((line) => line.startsWith("Link:"));

  let description = "";
  if (descriptionStart >= 0 && linkIndex > descriptionStart) {
    const descriptionLines = lines
      .slice(descriptionStart + 1, linkIndex)
      .map((line) => decodeHtmlEntities(line.trim()))
      .filter((line) => line.length > 0);

    description = normalizeWhitespace(descriptionLines.join(" "));
  }

  const { eventDate, eventEndDate } = parseDateRange(dateRaw);

  return {
    title,
    type: inferType(title),
    description,
    speaker: "",
    location: "IISc Aerospace Engineering",
    eventDate,
    eventEndDate,
    registrationUrl: link,
    isFeatured: false,
  };
}

function buildDataset(content) {
  const seenIds = new Set();
  const blocks = parseBlocks(content);
  const errors = [];

  const events = blocks
    .map((block, index) => {
      try {
        const parsed = parseBlock(block);
        const baseId = toBaseId(parsed.title);
        const id = resolveUniqueId(baseId, seenIds);
        return { id, ...parsed };
      } catch (error) {
        errors.push(`Block ${index + 1}: ${error.message}`);
        return null;
      }
    })
    .filter(Boolean);

  return { events, errors, totalBlocks: blocks.length };
}

const { events, errors, totalBlocks } = buildDataset(rawText);

if (!events.length) {
  console.error("No valid events parsed from scripts/events-raw.txt");
  errors.forEach((error) => console.error(error));
  process.exit(1);
}

fs.writeFileSync(outputPath, `${JSON.stringify(events, null, 2)}\n`, "utf8");

console.log(`Parsed ${events.length}/${totalBlocks} events and wrote scripts/events-data.json`);
if (errors.length) {
  console.log(`Encountered ${errors.length} parse warnings:`);
  errors.slice(0, 20).forEach((error) => console.log(`- ${error}`));
}

import fs from "node:fs";
import path from "node:path";

const sourcePath = path.resolve(process.cwd(), "scripts", "events-data.json");
const dataPath = path.resolve(process.cwd(), "src", "data", "data.json");

if (!fs.existsSync(sourcePath) || !fs.existsSync(dataPath)) {
  console.error("Required file missing. Ensure scripts/events-data.json and src/data/data.json exist.");
  process.exit(1);
}

const events = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
if (!Array.isArray(events)) {
  console.error("scripts/events-data.json must be an array.");
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dataPath, "utf8"));
db.events = events.map((event, index) => ({
  id: event.id || `event-${index + 1}`,
  ...event,
  createdAt: event.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

fs.writeFileSync(dataPath, JSON.stringify(db, null, 2));
console.log(`Updated local dataset with ${db.events.length} events.`);

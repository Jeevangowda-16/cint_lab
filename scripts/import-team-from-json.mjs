import fs from "node:fs";
import path from "node:path";

const sourcePath = path.resolve(process.cwd(), "scripts", "team-data.json");
const dataPath = path.resolve(process.cwd(), "src", "data", "data.json");

if (!fs.existsSync(sourcePath) || !fs.existsSync(dataPath)) {
  console.error("Required file missing. Ensure scripts/team-data.json and src/data/data.json exist.");
  process.exit(1);
}

const team = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
if (!Array.isArray(team)) {
  console.error("scripts/team-data.json must be an array.");
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dataPath, "utf8"));
db.team = team.map((member, index) => ({
  id: member.id || `team-${index + 1}`,
  ...member,
  createdAt: member.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

fs.writeFileSync(dataPath, JSON.stringify(db, null, 2));
console.log(`Updated local dataset with ${db.team.length} team members.`);

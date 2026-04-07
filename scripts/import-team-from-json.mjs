import fs from "node:fs";
import path from "node:path";
import admin from "firebase-admin";

const serviceAccountPath = path.resolve(process.cwd(), "service-account.json");
const teamJsonPath = path.resolve(process.cwd(), "scripts", "team-data.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("service-account.json not found in project root.");
  process.exit(1);
}

if (!fs.existsSync(teamJsonPath)) {
  console.error("scripts/team-data.json not found.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
const payload = JSON.parse(fs.readFileSync(teamJsonPath, "utf8"));

if (!payload || !Array.isArray(payload.people)) {
  console.error("team-data.json must contain an array at key 'people'.");
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const timestamp = admin.firestore.FieldValue.serverTimestamp();

function compact(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function toId(name) {
  return compact(name)
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 110);
}

function pickEmail(person) {
  const direct = compact(person.email);
  if (direct) return direct;

  const list = Array.isArray(person.emails) ? person.emails : [];
  const preferred = list.find((item) => {
    const val = compact(item).toLowerCase();
    return val && !val.includes("office");
  });

  return compact(preferred);
}

function buildBio(person) {
  const parts = [];

  if (compact(person.area)) parts.push(`Area: ${compact(person.area)}`);
  if (compact(person.office)) parts.push(`Office: ${compact(person.office)}`);
  if (compact(person.education)) parts.push(`Education: ${compact(person.education)}`);
  if (compact(person.workExperience)) parts.push(`Experience: ${compact(person.workExperience)}`);
  if (compact(person.researchInterests)) parts.push(`Research: ${compact(person.researchInterests)}`);

  return parts.join(" | ").slice(0, 2000);
}

function buildResearchAreas(person) {
  const values = [];
  const seen = new Set();

  const add = (item) => {
    const value = compact(item);
    const key = value.toLowerCase();
    if (!value || seen.has(key)) return;
    seen.add(key);
    values.push(value);
  };

  add(person.area);

  const interests = compact(person.researchInterests);
  if (interests) {
    interests
      .split(",")
      .map((item) => compact(item))
      .filter(Boolean)
      .forEach(add);
  }

  return values.slice(0, 8);
}

function deriveRoleCategory(designation) {
  return /professor/i.test(designation) ? "lead" : "associate";
}

async function run() {
  let imported = 0;
  let skipped = 0;

  for (let index = 0; index < payload.people.length; index += 1) {
    const person = payload.people[index] || {};
    const name = compact(person.name);
    const id = toId(name);

    if (!name || !id) {
      skipped += 1;
      console.warn(`Skipped record at index ${index} due to missing name.`);
      continue;
    }

    const designation = compact(person.designation) || "Faculty";

    await db
      .collection("team")
      .doc(id)
      .set(
        {
          id,
          name,
          roleCategory: deriveRoleCategory(designation),
          designation,
          bio: buildBio(person),
          researchAreas: buildResearchAreas(person),
          email: pickEmail(person),
          active: true,
          sortOrder: index + 1,
          profileUrl: compact(person.profileUrl),
          office: compact(person.office),
          phones: Array.isArray(person.phones) ? person.phones.map((item) => compact(item)).filter(Boolean) : [],
          emails: Array.isArray(person.emails) ? person.emails.map((item) => compact(item)).filter(Boolean) : [],
          area: compact(person.area),
          source: compact(payload.source),
          updatedAt: timestamp,
          createdAt: timestamp,
        },
        { merge: true }
      );

    imported += 1;
    console.log(`Upserted team/${id} (${name})`);
  }

  const total = await db.collection("team").count().get();
  console.log(`Done. Imported ${imported} records. Skipped ${skipped} records.`);
  console.log(`Total documents in team collection: ${total.data().count}`);
}

run().catch((error) => {
  console.error("Import failed:", error.message || error);
  process.exit(1);
});

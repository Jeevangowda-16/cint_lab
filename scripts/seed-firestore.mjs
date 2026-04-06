import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(rootDir, ".env.local");

  if (!fs.existsSync(envPath)) {
    throw new Error(".env.local not found. Create it before running the seed script.");
  }

  const content = fs.readFileSync(envPath, "utf8");

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const equalsIndex = line.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = line.slice(0, equalsIndex).trim();
    let value = line.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function parseExportedConst(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const match = source.match(/export\s+const\s+\w+\s*=\s*([\s\S]*);\s*$/);

  if (!match) {
    throw new Error(`Could not parse exported const from ${filePath}`);
  }

  const expression = match[1];
  // Source files are trusted project files, so evaluating this expression is safe here.
  return Function(`"use strict"; return (${expression});`)();
}

async function seedCollection(db, collectionName, records) {
  for (const record of records) {
    if (!record?.id) {
      throw new Error(`Record in ${collectionName} is missing an id`);
    }

    const { id, ...rest } = record;
    await setDoc(doc(db, collectionName, id), rest, { merge: true });
  }
}

async function run() {
  loadEnvLocal();

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const missing = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing Firebase config keys in .env.local: ${missing.join(", ")}`);
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const dummyDir = path.join(rootDir, "src", "data", "dummy");
  const projects = parseExportedConst(path.join(dummyDir, "projects.js"));
  const team = parseExportedConst(path.join(dummyDir, "team.js"));
  const interns = parseExportedConst(path.join(dummyDir, "interns.js"));
  const events = parseExportedConst(path.join(dummyDir, "events.js"));
  const publications = parseExportedConst(path.join(dummyDir, "publications.js"));
  const labOverview = parseExportedConst(path.join(dummyDir, "labOverview.js"));

  await seedCollection(db, "projects", projects);
  await seedCollection(db, "team", team);
  await seedCollection(db, "interns", interns);
  await seedCollection(db, "events", events);
  await seedCollection(db, "publications", publications);

  const { id: labOverviewId = "primary", ...labOverviewPayload } = labOverview;
  await setDoc(doc(db, "lab_overview", labOverviewId), labOverviewPayload, { merge: true });

  console.log("Seed complete");
  console.log(`projects: ${projects.length}`);
  console.log(`team: ${team.length}`);
  console.log(`interns: ${interns.length}`);
  console.log(`events: ${events.length}`);
  console.log(`publications: ${publications.length}`);
  console.log("lab_overview: 1");
}

run().catch((error) => {
  console.error("Seed failed:", error.message || error);
  process.exit(1);
});
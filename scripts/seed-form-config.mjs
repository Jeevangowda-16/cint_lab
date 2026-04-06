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
    throw new Error(".env.local not found");
  }

  const content = fs.readFileSync(envPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value.replace(/^['\"]|['\"]$/g, "");
    }
  }
}

async function run() {
  loadEnvLocal();

  const app = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });

  const db = getFirestore(app);

  await setDoc(
    doc(db, "form_config", "default"),
    {
      internshipInterestOptions: [
        "Artificial Intelligence",
        "Computer Vision",
        "Distributed Systems",
        "Algorithms",
        "Data Engineering",
        "Human-Centered AI",
      ],
      contactSubjectOptions: [
        "Internship Inquiry",
        "Research Collaboration",
        "Event Invitation",
        "General Question",
      ],
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  console.log("form_config/default seeded");
}

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
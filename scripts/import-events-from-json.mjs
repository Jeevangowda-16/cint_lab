import fs from "node:fs";
import path from "node:path";
import admin from "firebase-admin";

const serviceAccountPath = path.resolve(process.cwd(), "service-account.json");
const eventsJsonPath = path.resolve(process.cwd(), "scripts", "events-data.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("service-account.json not found in project root.");
  process.exit(1);
}

if (!fs.existsSync(eventsJsonPath)) {
  console.error("scripts/events-data.json not found.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
const eventsData = JSON.parse(fs.readFileSync(eventsJsonPath, "utf8"));

if (!Array.isArray(eventsData)) {
  console.error("events-data.json must be an array.");
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const timestamp = admin.firestore.FieldValue.serverTimestamp();

function toId(title) {
  return title
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 110);
}

async function clearExistingEvents() {
  const snapshot = await db.collection("events").get();
  for (const docItem of snapshot.docs) {
    await docItem.ref.delete();
    console.log(`Deleted events/${docItem.id}`);
  }
}

async function seedEvents() {
  for (const item of eventsData) {
    if (!item.title || !item.eventDate) {
      throw new Error(`Invalid event item: ${JSON.stringify(item)}`);
    }

    const id = item.id || toId(item.title);
    await db.collection("events").doc(id).set(
      {
        id,
        title: item.title,
        type: item.type || "seminar",
        description: item.description || "",
        speaker: item.speaker || "",
        location: item.location || "IISc Aerospace Engineering",
        eventDate: item.eventDate,
        eventEndDate: item.eventEndDate || "",
        registrationUrl: item.registrationUrl || "",
        isFeatured: Boolean(item.isFeatured),
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      { merge: true }
    );

    console.log(`Seeded events/${id}`);
  }
}

async function run() {
  await clearExistingEvents();
  await seedEvents();
  console.log(`Done. Imported ${eventsData.length} events.`);
}

run().catch((error) => {
  console.error("Import failed:", error.message || error);
  process.exit(1);
});

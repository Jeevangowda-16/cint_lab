import fs from "node:fs";
import path from "node:path";
import admin from "firebase-admin";

const serviceAccountPath = path.resolve(process.cwd(), "service-account.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("service-account.json not found in project root.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const keepInternIds = new Set([
  "harshavardhan-k",
  "mohammed-ayan",
  "abhay-b-suvarna",
  "gurmann-ajmani",
  "c-m-yuktha",
  "jeevan-d",
]);

async function deleteCollectionDocs(collectionName, shouldDelete) {
  const snapshot = await db.collection(collectionName).get();
  const docsToDelete = snapshot.docs.filter((doc) => shouldDelete(doc.id, doc.data()));

  for (const doc of docsToDelete) {
    await doc.ref.delete();
    console.log(`Deleted ${collectionName}/${doc.id}`);
  }

  return {
    total: snapshot.size,
    deleted: docsToDelete.length,
    kept: snapshot.size - docsToDelete.length,
  };
}

async function run() {
  const teamStats = await deleteCollectionDocs("team", () => true);
  const internStats = await deleteCollectionDocs("interns", (id) => !keepInternIds.has(id));

  console.log("Cleanup complete");
  console.log(`team: total=${teamStats.total}, deleted=${teamStats.deleted}, kept=${teamStats.kept}`);
  console.log(`interns: total=${internStats.total}, deleted=${internStats.deleted}, kept=${internStats.kept}`);
}

run().catch((error) => {
  console.error("Cleanup failed:", error.message || error);
  process.exit(1);
});

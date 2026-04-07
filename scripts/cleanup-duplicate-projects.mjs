import fs from "node:fs";
import path from "node:path";
import admin from "firebase-admin";

const serviceAccountPath = path.resolve(process.cwd(), "service-account.json");
const DRY_RUN = process.env.DRY_RUN === "1";

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
const NEG_INF = Number.NEGATIVE_INFINITY;

function normalizeTitle(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function toMillis(value) {
  if (value == null) return NEG_INF;

  if (typeof value?.toMillis === "function") {
    const ms = value.toMillis();
    return Number.isFinite(ms) ? ms : NEG_INF;
  }

  if (value instanceof Date) {
    const ms = value.getTime();
    return Number.isFinite(ms) ? ms : NEG_INF;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : NEG_INF;
  }

  if (typeof value === "string") {
    const ms = Date.parse(value);
    return Number.isFinite(ms) ? ms : NEG_INF;
  }

  if (typeof value === "object") {
    if (typeof value.seconds === "number") {
      const nanos = typeof value.nanoseconds === "number" ? value.nanoseconds : 0;
      return value.seconds * 1000 + Math.floor(nanos / 1e6);
    }

    if (typeof value._seconds === "number") {
      const nanos = typeof value._nanoseconds === "number" ? value._nanoseconds : 0;
      return value._seconds * 1000 + Math.floor(nanos / 1e6);
    }
  }

  return NEG_INF;
}

function getNumericSortOrder(data) {
  const raw = data?.sortOrder;

  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw;
  }

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.length > 0) {
      const parsed = Number(trimmed);
      if (Number.isFinite(parsed)) return parsed;
    }
  }

  return null;
}

function compareForCanonical(a, b) {
  const aSort = getNumericSortOrder(a.data);
  const bSort = getNumericSortOrder(b.data);

  if (aSort !== null && bSort === null) return -1;
  if (aSort === null && bSort !== null) return 1;
  if (aSort !== null && bSort !== null && aSort !== bSort) return aSort - bSort;

  const aUpdated = toMillis(a.data?.updatedAt);
  const bUpdated = toMillis(b.data?.updatedAt);
  if (aUpdated !== bUpdated) return bUpdated - aUpdated;

  const aCreated = toMillis(a.data?.createdAt);
  const bCreated = toMillis(b.data?.createdAt);
  if (aCreated !== bCreated) return bCreated - aCreated;

  return a.id.localeCompare(b.id);
}

async function run() {
  console.log(DRY_RUN ? "Mode: DRY_RUN=1 (no deletes will be executed)" : "Mode: LIVE (duplicates will be deleted)");

  const snapshot = await db.collection("projects").get();
  const totalDocs = snapshot.size;
  const groups = new Map();

  for (const doc of snapshot.docs) {
    const data = doc.data() || {};
    const normalizedTitle = normalizeTitle(data.title);
    const key = normalizedTitle || "__id__:" + doc.id;

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push({
      id: doc.id,
      ref: doc.ref,
      data,
    });
  }

  let duplicateGroups = 0;
  let deletedDocs = 0;

  for (const [key, docs] of groups.entries()) {
    if (docs.length < 2) continue;

    duplicateGroups += 1;
    const sorted = [...docs].sort(compareForCanonical);
    const keep = sorted[0];
    const toDelete = sorted.slice(1);
    const deleteIds = toDelete.map((item) => item.id);

    deletedDocs += toDelete.length;

    console.log("");
    console.log("Duplicate group: " + key);
    console.log("  keep: " + keep.id);
    console.log("  delete: " + (deleteIds.length ? deleteIds.join(", ") : "(none)"));

    if (!DRY_RUN && toDelete.length > 0) {
      const batch = db.batch();
      for (const item of toDelete) {
        batch.delete(item.ref);
      }
      await batch.commit();
    }
  }

  const remainingDocs = totalDocs - deletedDocs;

  console.log("");
  console.log("Summary");
  console.log("  total docs: " + totalDocs);
  console.log("  duplicate groups: " + duplicateGroups);
  console.log("  deleted docs: " + deletedDocs);
  console.log("  remaining docs: " + remainingDocs);
}

run()
  .then(async () => {
    if (admin.apps.length) {
      await admin.app().delete();
    }
  })
  .catch(async (error) => {
    console.error("Cleanup failed:", error?.message || error);
    if (admin.apps.length) {
      await admin.app().delete();
    }
    process.exit(1);
  });

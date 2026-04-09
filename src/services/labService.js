import { getCollection, upsertDocument } from "@/lib/localDataStore";

const COLLECTION_NAME = "lab_overview";

export async function getLabOverview() {
  const rows = getCollection(COLLECTION_NAME);

  if (rows.length > 0) {
    return rows[0];
  }

  return null;
}

export async function updateLabOverview(payload) {
  const updated = upsertDocument(
    COLLECTION_NAME,
    payload.id || "primary",
    {
      ...payload,
    },
    { merge: true, touchUpdatedAt: true }
  );

  return updated;
}

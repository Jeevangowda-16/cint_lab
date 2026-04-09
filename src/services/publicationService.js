import { addItem, deleteItem, getCollection, updateItem } from "@/lib/localDataStore";
import {
  ensureRequiredFields,
} from "@/services/helpers";

const COLLECTION_NAME = "publications";

export async function getPublications() {
  const publications = getCollection(COLLECTION_NAME);

  return publications.sort((a, b) => Number(b.year) - Number(a.year));
}

export async function addPublication(payload) {
  ensureRequiredFields(payload, ["title", "authors", "year", "venue"]);
  const created = addItem(
    COLLECTION_NAME,
    {
    ...payload,
    },
    { withTimestamps: true }
  );

  return { id: created.id, ...payload };
}

export async function updatePublication(publicationId, payload) {
  updateItem(COLLECTION_NAME, publicationId, payload, { touchUpdatedAt: true });

  return { id: publicationId, ...payload };
}

export async function deletePublication(publicationId) {
  return deleteItem(COLLECTION_NAME, publicationId);
}

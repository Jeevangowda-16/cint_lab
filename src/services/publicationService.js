import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  asFirestoreList,
  ensureRequiredFields,
} from "@/services/helpers";

const COLLECTION_NAME = "publications";

export async function getPublications() {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME)));
  const publications = asFirestoreList(snapshot);

  return publications.sort((a, b) => Number(b.year) - Number(a.year));
}

export async function addPublication(payload) {
  ensureRequiredFields(payload, ["title", "authors", "year", "venue"]);
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const ref = await addDoc(collection(db, COLLECTION_NAME), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: ref.id, ...payload };
}

export async function updatePublication(publicationId, payload) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const ref = doc(db, COLLECTION_NAME, publicationId);
  await updateDoc(ref, {
    ...payload,
    updatedAt: serverTimestamp(),
  });

  return { id: publicationId, ...payload };
}

export async function deletePublication(publicationId) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  await deleteDoc(doc(db, COLLECTION_NAME, publicationId));
  return { success: true };
}

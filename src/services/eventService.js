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
  sortByDateDesc,
} from "@/services/helpers";

const COLLECTION_NAME = "events";

export async function getEvents(filters = {}) {
  const { type, featuredOnly } = filters;
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME)));
  let events = asFirestoreList(snapshot);

  if (type && type !== "all") {
    events = events.filter((eventItem) => eventItem.type === type);
  }

  if (featuredOnly) {
    events = events.filter((eventItem) => eventItem.isFeatured);
  }

  return sortByDateDesc(events, "eventDate");
}

export async function addEvent(payload) {
  ensureRequiredFields(payload, ["title", "type", "eventDate"]);
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

export async function updateEvent(eventId, payload) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const ref = doc(db, COLLECTION_NAME, eventId);
  await updateDoc(ref, {
    ...payload,
    updatedAt: serverTimestamp(),
  });

  return { id: eventId, ...payload };
}

export async function deleteEvent(eventId) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  await deleteDoc(doc(db, COLLECTION_NAME, eventId));
  return { success: true };
}

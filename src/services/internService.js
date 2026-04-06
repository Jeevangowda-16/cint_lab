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

const COLLECTION_NAME = "interns";

export async function getInterns(filters = {}) {
  const { status, cohort } = filters;
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME)));
  let interns = asFirestoreList(snapshot);

  if (status && status !== "all") {
    interns = interns.filter((intern) => intern.status === status);
  }

  if (cohort && cohort !== "all") {
    interns = interns.filter((intern) => intern.cohort === cohort);
  }

  return sortByDateDesc(interns, "updatedAt");
}

export async function addIntern(payload) {
  ensureRequiredFields(payload, ["name", "program", "cohort", "status"]);
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

export async function updateIntern(internId, payload) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const ref = doc(db, COLLECTION_NAME, internId);
  await updateDoc(ref, {
    ...payload,
    updatedAt: serverTimestamp(),
  });

  return { id: internId, ...payload };
}

export async function deleteIntern(internId) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  await deleteDoc(doc(db, COLLECTION_NAME, internId));
  return { success: true };
}

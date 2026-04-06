import { addDoc, collection, getDocs, query, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { asFirestoreList, ensureRequiredFields, sortByDateDesc } from "@/services/helpers";

const COLLECTION_NAME = "applications";

export async function submitApplication(payload) {
  ensureRequiredFields(payload, ["fullName", "email", "institution", "statement"]);
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const ref = await addDoc(collection(db, COLLECTION_NAME), {
    ...payload,
    status: "submitted",
    submittedAt: serverTimestamp(),
  });

  return {
    success: true,
    mode: "firestore",
    id: ref.id,
  };
}

export async function getApplications() {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME)));
  return sortByDateDesc(asFirestoreList(snapshot), "submittedAt");
}

export async function updateApplication(applicationId, payload) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const ref = doc(db, COLLECTION_NAME, applicationId);
  await updateDoc(ref, payload);

  return { id: applicationId, ...payload };
}

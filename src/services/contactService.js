import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { asFirestoreList, ensureRequiredFields, sortByDateDesc } from "@/services/helpers";

const COLLECTION_NAME = "contacts";

export async function getContactMetadata() {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const overviewDoc = await getDoc(doc(db, "lab_overview", "primary"));
  const contact = overviewDoc.data()?.contact || {};

  return {
    email: contact.email || "",
    office: contact.office || "",
    organization: contact.organization || "",
  };
}

export async function submitContact(payload) {
  ensureRequiredFields(payload, ["fullName", "email", "subject", "message"]);
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const ref = await addDoc(collection(db, COLLECTION_NAME), {
    ...payload,
    status: "new",
    submittedAt: serverTimestamp(),
  });

  return {
    success: true,
    mode: "firestore",
    id: ref.id,
  };
}

export async function getContacts() {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME)));
  return sortByDateDesc(asFirestoreList(snapshot), "submittedAt");
}

export async function updateContact(contactId, payload) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const ref = doc(db, COLLECTION_NAME, contactId);
  await updateDoc(ref, payload);

  return { id: contactId, ...payload };
}

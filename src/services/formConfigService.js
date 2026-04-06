import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const COLLECTION_NAME = "form_config";
const DEFAULT_DOC_ID = "default";

export async function getFormConfig() {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const snapshot = await getDoc(doc(db, COLLECTION_NAME, DEFAULT_DOC_ID));

  if (!snapshot.exists()) {
    throw new Error("Form configuration not found in Firestore (form_config/default).");
  }

  const data = snapshot.data() || {};

  return {
    internshipInterestOptions: data.internshipInterestOptions || [],
    contactSubjectOptions: data.contactSubjectOptions || [],
  };
}
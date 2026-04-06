import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { asFirestoreList } from "@/services/helpers";

const COLLECTION_NAME = "lab_overview";

export async function getLabOverview() {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  const rows = asFirestoreList(snapshot);

  if (rows.length > 0) {
    return rows[0];
  }

  return null;
}

export async function updateLabOverview(payload) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const ref = doc(db, COLLECTION_NAME, payload.id || "primary");

  await setDoc(
    ref,
    {
      ...payload,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  const updated = await getDoc(ref);
  return { id: updated.id, ...updated.data() };
}

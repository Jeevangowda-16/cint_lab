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

const COLLECTION_NAME = "team";
const ROLE_ORDER = {
  lead: 1,
  associate: 2,
  alumni: 3,
};

export async function getTeamMembers(filters = {}) {
  const { roleCategory, activeOnly } = filters;
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME)));
  let teamMembers = asFirestoreList(snapshot);

  if (roleCategory && roleCategory !== "all") {
    teamMembers = teamMembers.filter((member) => member.roleCategory === roleCategory);
  }

  if (activeOnly) {
    teamMembers = teamMembers.filter((member) => member.active);
  }

  return teamMembers.sort((a, b) => {
    if (a.roleCategory === b.roleCategory) {
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    }

    return (ROLE_ORDER[a.roleCategory] || 99) - (ROLE_ORDER[b.roleCategory] || 99);
  });
}

export async function addTeamMember(payload) {
  ensureRequiredFields(payload, ["name", "roleCategory", "designation"]);
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

export async function updateTeamMember(memberId, payload) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const ref = doc(db, COLLECTION_NAME, memberId);
  await updateDoc(ref, {
    ...payload,
    updatedAt: serverTimestamp(),
  });

  return { id: memberId, ...payload };
}

export async function deleteTeamMember(memberId) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  await deleteDoc(doc(db, COLLECTION_NAME, memberId));
  return { success: true };
}

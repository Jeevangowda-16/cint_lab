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

const COLLECTION_NAME = "projects";

export async function getProjects(filters = {}) {
  const { status, tag } = filters;
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const snapshot = await getDocs(query(collection(db, COLLECTION_NAME)));
  let projects = asFirestoreList(snapshot);

  if (status) {
    projects = projects.filter((project) => project.status === status);
  }

  if (tag) {
    projects = projects.filter((project) => (project.tags || []).includes(tag));
  }

  return sortByDateDesc(projects, "updatedAt");
}

export async function addProject(payload) {
  ensureRequiredFields(payload, ["title", "summary", "status"]);
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

export async function updateProject(projectId, payload) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  const ref = doc(db, COLLECTION_NAME, projectId);
  await updateDoc(ref, {
    ...payload,
    updatedAt: serverTimestamp(),
  });

  return { id: projectId, ...payload };
}

export async function deleteProject(projectId) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  await deleteDoc(doc(db, COLLECTION_NAME, projectId));
  return { success: true };
}

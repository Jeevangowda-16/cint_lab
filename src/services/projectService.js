import {
  addDoc,
  collection,
  deleteDoc,
  getDoc,
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

  const sortedProjects = [...projects].sort((a, b) => {
    const aSort = typeof a.sortOrder === "number" ? a.sortOrder : 9999;
    const bSort = typeof b.sortOrder === "number" ? b.sortOrder : 9999;

    if (aSort !== bSort) {
      return aSort - bSort;
    }

    return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
  });

  const seen = new Set();
  const uniqueProjects = [];

  for (const project of sortedProjects) {
    const key = String(project.title || project.id || "").trim().toLowerCase();
    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    uniqueProjects.push(project);
  }

  return uniqueProjects;
}

export async function getProjectById(projectId) {
  if (!db) {
    throw new Error("Firebase is not configured.");
  }

  if (!projectId) {
    return null;
  }

  const snapshot = await getDoc(doc(db, COLLECTION_NAME, projectId));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
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

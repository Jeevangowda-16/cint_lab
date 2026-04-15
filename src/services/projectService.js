import { addItem, deleteItem, getById, getCollection, updateItem } from "@/lib/localDataStore";
import {
  ensureRequiredFields,
} from "@/services/helpers";

const COLLECTION_NAME = "projects";

function normalizeProjectKey(project) {
  return String(project.title || project.id || "")
    .trim()
    .toLowerCase()
    .replace(/vedio/g, "video")
    .replace(/\s+/g, " ");
}

export async function getProjects(filters = {}) {
  const { status, tag } = filters;
  let projects = getCollection(COLLECTION_NAME);

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
    const key = normalizeProjectKey(project);
    if (!key || seen.has(key)) {
      continue;
    }

    seen.add(key);
    uniqueProjects.push(project);
  }

  return uniqueProjects;
}

export async function getProjectById(projectId) {
  if (!projectId) {
    return null;
  }

  return getById(COLLECTION_NAME, projectId);
}

export async function addProject(payload) {
  ensureRequiredFields(payload, ["title", "summary", "status"]);
  const created = addItem(
    COLLECTION_NAME,
    {
    ...payload,
    },
    { withTimestamps: true }
  );

  return { id: created.id, ...payload };
}

export async function updateProject(projectId, payload) {
  updateItem(COLLECTION_NAME, projectId, payload, { touchUpdatedAt: true });

  return { id: projectId, ...payload };
}

export async function deleteProject(projectId) {
  return deleteItem(COLLECTION_NAME, projectId);
}

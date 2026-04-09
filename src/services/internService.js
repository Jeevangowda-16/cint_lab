import { addItem, deleteItem, getCollection, updateItem } from "@/lib/localDataStore";
import {
  ensureRequiredFields,
  sortByDateDesc,
} from "@/services/helpers";

const COLLECTION_NAME = "interns";

export async function getInterns(filters = {}) {
  const { status, cohort, projectId } = filters;
  let interns = getCollection(COLLECTION_NAME);

  if (status && status !== "all") {
    interns = interns.filter((intern) => intern.status === status);
  }

  if (cohort && cohort !== "all") {
    interns = interns.filter((intern) => intern.cohort === cohort);
  }

  if (projectId && projectId !== "all") {
    interns = interns.filter((intern) => intern.projectId === projectId);
  }

  return sortByDateDesc(interns, "updatedAt");
}

export async function addIntern(payload) {
  ensureRequiredFields(payload, ["name", "program", "cohort", "status", "projectId"]);
  const created = addItem(
    COLLECTION_NAME,
    {
    ...payload,
    },
    { withTimestamps: true }
  );

  return { id: created.id, ...payload };
}

export async function updateIntern(internId, payload) {
  updateItem(COLLECTION_NAME, internId, payload, { touchUpdatedAt: true });

  return { id: internId, ...payload };
}

export async function deleteIntern(internId) {
  return deleteItem(COLLECTION_NAME, internId);
}

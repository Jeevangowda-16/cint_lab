import { addItem, getCollection, updateItem } from "@/lib/localDataStore";
import { ensureRequiredFields, sortByDateDesc } from "@/services/helpers";

const COLLECTION_NAME = "applications";

export async function submitApplication(payload) {
  ensureRequiredFields(payload, ["fullName", "email", "institution", "statement"]);

  const created = addItem(COLLECTION_NAME, {
    ...payload,
    status: "submitted",
    submittedAt: new Date().toISOString(),
  });

  return {
    success: true,
    mode: "local",
    id: created.id,
  };
}

export async function getApplications() {
  const applications = getCollection(COLLECTION_NAME);
  return sortByDateDesc(applications, "submittedAt");
}

export async function updateApplication(applicationId, payload) {
  updateItem(COLLECTION_NAME, applicationId, payload);

  return { id: applicationId, ...payload };
}

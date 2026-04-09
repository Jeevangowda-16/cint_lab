import { getById } from "@/lib/localDataStore";

const COLLECTION_NAME = "form_config";
const DEFAULT_DOC_ID = "default";

export async function getFormConfig() {
  const data = getById(COLLECTION_NAME, DEFAULT_DOC_ID);

  if (!data) {
    throw new Error("Form configuration not found in local data (form_config/default).");
  }

  return {
    internshipInterestOptions: data.internshipInterestOptions || [],
    contactSubjectOptions: data.contactSubjectOptions || [],
  };
}
import { addItem, getById, getCollection, updateItem } from "@/lib/localDataStore";
import { ensureRequiredFields, sortByDateDesc } from "@/services/helpers";

const COLLECTION_NAME = "contacts";

export async function getContactMetadata() {
  const overview = getById("lab_overview", "primary");
  const contact = overview?.contact || {};

  return {
    email: contact.email || "",
    office: contact.office || "",
    organization: contact.organization || "",
  };
}

export async function submitContact(payload) {
  ensureRequiredFields(payload, ["fullName", "email", "subject", "message"]);

  const created = addItem(COLLECTION_NAME, {
    ...payload,
    status: "new",
    submittedAt: new Date().toISOString(),
  });

  return {
    success: true,
    mode: "local",
    id: created.id,
  };
}

export async function getContacts() {
  const contacts = getCollection(COLLECTION_NAME);
  return sortByDateDesc(contacts, "submittedAt");
}

export async function updateContact(contactId, payload) {
  updateItem(COLLECTION_NAME, contactId, payload);

  return { id: contactId, ...payload };
}

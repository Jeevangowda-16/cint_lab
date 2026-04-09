import { addItem, deleteItem, getCollection, updateItem } from "@/lib/localDataStore";
import {
  ensureRequiredFields,
  sortByDateDesc,
} from "@/services/helpers";

const COLLECTION_NAME = "events";

export async function getEvents(filters = {}) {
  const { type, featuredOnly } = filters;
  let events = getCollection(COLLECTION_NAME);

  if (type && type !== "all") {
    events = events.filter((eventItem) => eventItem.type === type);
  }

  if (featuredOnly) {
    events = events.filter((eventItem) => eventItem.isFeatured);
  }

  return sortByDateDesc(events, "eventDate");
}

export async function addEvent(payload) {
  ensureRequiredFields(payload, ["title", "type", "eventDate"]);
  const created = addItem(
    COLLECTION_NAME,
    {
    ...payload,
    },
    { withTimestamps: true }
  );

  return { id: created.id, ...payload };
}

export async function updateEvent(eventId, payload) {
  updateItem(COLLECTION_NAME, eventId, payload, { touchUpdatedAt: true });

  return { id: eventId, ...payload };
}

export async function deleteEvent(eventId) {
  return deleteItem(COLLECTION_NAME, eventId);
}

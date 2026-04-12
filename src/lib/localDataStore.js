import initialData from "@/data/data.json";

const STORAGE_KEY = "cint-lab-local-data-v1";

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix = "item") {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

let serverState = deepClone(initialData);
let clientState = null;

function isBrowser() {
  return typeof window !== "undefined";
}

function ensureCollection(state, collectionName) {
  if (!Array.isArray(state[collectionName])) {
    state[collectionName] = [];
  }

  return state[collectionName];
}

function mergeStoredStateWithSeed(seedState, storedState) {
  const mergedState = deepClone(seedState);

  Object.keys(storedState || {}).forEach((collectionName) => {
    const storedValue = storedState[collectionName];

    if (Array.isArray(storedValue) && Array.isArray(seedState[collectionName])) {
      const storedById = new Map(
        storedValue
          .filter((item) => item && item.id)
          .map((item) => [item.id, item])
      );

      const mergedRows = seedState[collectionName].map((seedItem) => {
        const existingItem = storedById.get(seedItem.id);
        return existingItem ? { ...seedItem, ...existingItem } : seedItem;
      });

      storedValue.forEach((item) => {
        if (!item || !item.id) {
          return;
        }

        if (!mergedRows.some((row) => row.id === item.id)) {
          mergedRows.push(item);
        }
      });

      mergedState[collectionName] = mergedRows;
      return;
    }

    if (!(collectionName in mergedState)) {
      mergedState[collectionName] = storedValue;
    }
  });

  return mergedState;
}

function loadClientState() {
  if (!isBrowser()) {
    return serverState;
  }

  if (clientState) {
    return clientState;
  }

  const fallback = deepClone(initialData);

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    clientState = raw ? mergeStoredStateWithSeed(fallback, JSON.parse(raw)) : fallback;
  } catch {
    clientState = fallback;
  }

  return clientState;
}

function getState() {
  return isBrowser() ? loadClientState() : serverState;
}

function persistIfNeeded() {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clientState));
  } catch {
    // Ignore localStorage quota and availability issues.
  }
}

export function getCollection(collectionName) {
  const state = getState();
  const rows = ensureCollection(state, collectionName);
  return deepClone(rows);
}

export function getById(collectionName, itemId) {
  const state = getState();
  const rows = ensureCollection(state, collectionName);
  const item = rows.find((row) => row.id === itemId);
  return item ? deepClone(item) : null;
}

export function addItem(collectionName, payload, options = {}) {
  const state = getState();
  const rows = ensureCollection(state, collectionName);
  const idPrefix = options.idPrefix || collectionName.replace(/s$/, "") || "item";

  const item = {
    id: payload.id || createId(idPrefix),
    ...payload,
  };

  if (options.withTimestamps) {
    const timestamp = nowIso();
    item.createdAt = item.createdAt || timestamp;
    item.updatedAt = timestamp;
  }

  rows.push(item);
  persistIfNeeded();
  return deepClone(item);
}

export function updateItem(collectionName, itemId, payload, options = {}) {
  const state = getState();
  const rows = ensureCollection(state, collectionName);
  const index = rows.findIndex((row) => row.id === itemId);

  if (index === -1) {
    throw new Error(`Record not found in ${collectionName}: ${itemId}`);
  }

  rows[index] = {
    ...rows[index],
    ...payload,
  };

  if (options.touchUpdatedAt) {
    rows[index].updatedAt = nowIso();
  }

  persistIfNeeded();
  return deepClone(rows[index]);
}

export function deleteItem(collectionName, itemId) {
  const state = getState();
  const rows = ensureCollection(state, collectionName);
  const index = rows.findIndex((row) => row.id === itemId);

  if (index === -1) {
    return { success: true };
  }

  rows.splice(index, 1);
  persistIfNeeded();
  return { success: true };
}

export function upsertDocument(collectionName, documentId, payload, options = {}) {
  const state = getState();
  const rows = ensureCollection(state, collectionName);
  const index = rows.findIndex((row) => row.id === documentId);

  if (index === -1) {
    const created = {
      id: documentId,
      ...payload,
    };

    if (options.touchUpdatedAt) {
      created.updatedAt = nowIso();
    }

    rows.push(created);
    persistIfNeeded();
    return deepClone(created);
  }

  rows[index] = options.merge
    ? { ...rows[index], ...payload }
    : { id: documentId, ...payload };

  if (options.touchUpdatedAt) {
    rows[index].updatedAt = nowIso();
  }

  persistIfNeeded();
  return deepClone(rows[index]);
}

export function resetLocalData() {
  if (isBrowser()) {
    clientState = deepClone(initialData);
    persistIfNeeded();
    return;
  }

  serverState = deepClone(initialData);
}

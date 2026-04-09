function toTimeValue(value) {
  if (!value) {
    return 0;
  }

  if (typeof value === "object" && typeof value.toDate === "function") {
    return value.toDate().getTime();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  return new Date(value).getTime() || 0;
}

export function sortByDateDesc(items, fieldName) {
  return [...items].sort((a, b) => toTimeValue(b[fieldName]) - toTimeValue(a[fieldName]));
}

export function ensureRequiredFields(data, requiredFields) {
  const missing = requiredFields.filter((field) => !data[field]);

  if (missing.length) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }
}

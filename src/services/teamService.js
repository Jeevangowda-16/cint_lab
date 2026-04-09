import { addItem, deleteItem, getCollection, updateItem } from "@/lib/localDataStore";
import {
  ensureRequiredFields,
} from "@/services/helpers";

const COLLECTION_NAME = "team";
const ROLE_ORDER = {
  lead: 1,
  associate: 2,
  alumni: 3,
};

export async function getTeamMembers(filters = {}) {
  const { roleCategory, activeOnly } = filters;
  let teamMembers = getCollection(COLLECTION_NAME);

  if (roleCategory && roleCategory !== "all") {
    teamMembers = teamMembers.filter((member) => member.roleCategory === roleCategory);
  }

  if (activeOnly) {
    teamMembers = teamMembers.filter((member) => member.active);
  }

  return teamMembers.sort((a, b) => {
    if (a.roleCategory === b.roleCategory) {
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    }

    return (ROLE_ORDER[a.roleCategory] || 99) - (ROLE_ORDER[b.roleCategory] || 99);
  });
}

export async function addTeamMember(payload) {
  ensureRequiredFields(payload, ["name", "roleCategory", "designation"]);
  const created = addItem(
    COLLECTION_NAME,
    {
    ...payload,
    },
    { withTimestamps: true }
  );

  return { id: created.id, ...payload };
}

export async function updateTeamMember(memberId, payload) {
  updateItem(COLLECTION_NAME, memberId, payload, { touchUpdatedAt: true });

  return { id: memberId, ...payload };
}

export async function deleteTeamMember(memberId) {
  return deleteItem(COLLECTION_NAME, memberId);
}

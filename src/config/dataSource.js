import { isFirebaseConfigured } from "@/lib/firebase";

export const SHOULD_USE_FIREBASE = isFirebaseConfigured;
export const ACTIVE_DATA_SOURCE = "firestore";

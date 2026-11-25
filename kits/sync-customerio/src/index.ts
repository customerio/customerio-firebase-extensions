// Export names match the extension's function names so migrated instances keep the same functions.
export { authOnCreate as createAuthProfile, authOnDelete as deleteAuthProfile } from "./auth_handler";
export { firestoreOnWrite as syncFirestoreProfile } from "./firestore_handler";

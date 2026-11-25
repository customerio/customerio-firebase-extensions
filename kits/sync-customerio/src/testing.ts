import type { DocumentSnapshot } from "firebase-functions/v2/firestore";

// Minimal stand-in for a Firestore snapshot; omit data for a document that doesn't exist.
export function fakeSnapshot(id: string, data?: Record<string, any>): DocumentSnapshot {
  return {
    id,
    exists: data !== undefined,
    data: () => data,
    get: (field: string) => data?.[field],
  } as unknown as DocumentSnapshot;
}

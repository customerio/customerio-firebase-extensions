import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { expr } from "firebase-functions/params";
import { Context } from "./context";
import { buildUserRecord } from "./utils";
import { UserRecord } from "./types";
import { API_KEY, LOCATION, USERS_COLLECTION } from "./params";

export const firestoreOnWrite = onDocumentWritten({
  document: expr`${USERS_COLLECTION}/{id}`,
  region: LOCATION,
  secrets: [API_KEY],
}, async (event): Promise<void> => {
  const change = event.data;
  if ( !change ) {
    return;
  }

  const ctx = Context.get();
  const documentId: string = event.params.id;
  ctx.info("starting sync", {document_id: documentId});

  // An invalid previous version only loses the removed-attribute diff; it must not block
  // a write that fixes the document.
  let prev: UserRecord | null = null;
  if ( change.before.exists ) {
    const result = buildUserRecord(ctx, documentId, change.before);
    if ( result.error ) {
      ctx.error("error building before user record", {
        data: change.before.data(),
        error: result.error,
      });
    } else {
      prev = result.value;
    }
  }

  if ( !change.after.exists ) {
    if ( !prev ) {
      ctx.error("skipping profile delete: no valid identifier on the deleted document", {document_id: documentId});
      return;
    }
    try {
      await ctx.destroy(prev.identifier.value);
      ctx.info("deleted profile", {profile: prev});
    } catch (err) {
      ctx.error("error deleting profile", Context.describeError(err));
    }
    return;
  }

  const result = buildUserRecord(ctx, documentId, change.after);
  if ( result.error ) {
    ctx.error("error building after user record", {
      data: change.after.data(),
      error: result.error,
    });
    return;
  }
  const next: UserRecord = result.value;

  ctx.info("checking for changes", {
    before: prev,
    after: next,
    is_new: !change.before.exists,
  });

  // Attributes removed from the document are cleared in Customer.io by sending them as "".
  const attrChanges = next.attributes || {};
  if ( prev?.attributes ) {
    Object.keys(prev.attributes).forEach((key) => {
      if ( !attrChanges.hasOwnProperty(key) ) {
        attrChanges[key] = "";
      }
    });
  }

  if ( !change.before.exists && !attrChanges.hasOwnProperty("created_at") ) {
    attrChanges["created_at"] = Math.trunc(Date.now() / 1000);
  }

  try {
    await ctx.identify(next.identifier.value, attrChanges);
    ctx.info("synced profile", {profile: {identifier: next.identifier, attributes: attrChanges}});
  } catch (err) {
    ctx.error("error syncing profile", Context.describeError(err));
  }
});

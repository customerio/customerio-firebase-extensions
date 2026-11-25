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

  let prev: UserRecord = {} as UserRecord;
  let next: UserRecord = {} as UserRecord;

  if ( change.before.exists ) {
    const result = buildUserRecord(ctx, documentId, change.before);
    if ( result.error ) {
      ctx.error("error building before user record", {
        data: change.before.data(),
        error: result.error,
      });
      return;
    }
    prev = result.value;
  }

  if ( change.after.exists ) {
    const result = buildUserRecord(ctx, documentId, change.after);
    if ( result.error ) {
      ctx.error("error building after user record", {
        data: change.after.data(),
        error: result.error,
      });
      return;
    }
    next = result.value;
  } else {
    try {
      await ctx.destroy(prev.identifier.value);
      ctx.info("deleted profile", {profile: prev});
    } catch (err) {
      ctx.error("error deleting profile", {error: err});
    }
    return;
  }

  ctx.info("checking for changes", {
    before: prev,
    after: next,
    is_new: !change.before.exists,
  });

  // Attributes removed from the document are cleared in Customer.io by sending them as "".
  const attrChanges = next.attributes || {};
  if ( prev.attributes ) {
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
    ctx.error("error syncing profile", err);
  }
});

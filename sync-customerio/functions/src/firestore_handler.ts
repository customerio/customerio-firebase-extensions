import * as functions from "firebase-functions";
import { Context } from "./context";
import { buildUserRecord } from "./utils";
import { UserRecord } from "./types";

const ctx = Context.get();

export const firestoreOnWrite = functions.firestore.document(ctx.config.collection).onWrite(async (change: functions.Change<functions.firestore.DocumentSnapshot>): Promise<void>  => {
  ctx.info("starting extension", {
    document_id: change.after.id,
    change: change,
  });

  let documentId: string = change.after.id;
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
    // document has been deleted
    try {
      await ctx.destroy(prev.identifier.value)
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

  let attrChanges = next.attributes || {};
  if ( prev.attributes ) {
    Object.keys(prev.attributes).forEach((key) => {
      if ( !attrChanges.hasOwnProperty(key) ) {
        attrChanges[key] = "";
      }
    });
  }

  // set created_at attribute for new profiles if not defined
  if ( !change.before.exists && !attrChanges.hasOwnProperty("created_at") ) {
    attrChanges["created_at"] = Math.trunc(Date.now() / 1000);
  }

  try {
    await ctx.identify(next.identifier.value, attrChanges)
    ctx.info("synced profile", {profile: {identifier: next.identifier, attributes: attrChanges}});
  } catch (err) {
    ctx.error("error syncing profile",  err);
  }
});

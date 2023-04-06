import * as functions from "firebase-functions";
import { Context } from "./context";

export const authOnCreate = functions.auth.user().onCreate(async (user: functions.auth.UserRecord) => {
  const ctx = Context.get();
  ctx.info("starting extension", {user: user});

  const attributes = {
    email: user.email,
    phone: user.phoneNumber,
    email_verified: user.emailVerified,
    display_name: user.displayName,
    photo_url: user.photoURL,
    disabled: user.disabled,
    created_at: Math.trunc(Date.parse(user.metadata.creationTime)/1000),
    last_sign_in: Math.trunc(Date.parse(user.metadata.lastSignInTime)/1000),
  };

  ctx.identify(user.uid, attributes).then(
    () => {
      ctx.info("created profile", {customer_id: user.uid, attributes: attributes});
    },
    (err) => {
      ctx.error("error creating profile", {error: err});
    },
  );
});

export const authOnDelete = functions.auth.user().onDelete(async (user: functions.auth.UserRecord) => {
  const ctx = Context.get();
  ctx.info("starting extension", {user: user});

  ctx.destroy(user.uid).then(
    () => {
      ctx.info("deleted profile", {customer_id: user.uid});
    },
    (err) => {
      ctx.error("error deleting profile", {error: err});
    },
  );
});

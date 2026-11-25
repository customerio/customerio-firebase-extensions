import { onUserCreated, onUserDeleted } from "firebase-functions/v2/identity";
import { Context } from "./context";
import { API_KEY, LOCATION } from "./params";

const options = { region: LOCATION, secrets: [API_KEY] };

export const authOnCreate = onUserCreated(options, async (event) => {
  const user = event.data;
  const ctx = Context.get();
  ctx.info("starting sync", {user: user});

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

  try {
    await ctx.identify(user.uid, attributes);
    ctx.info("created profile", {customer_id: user.uid, attributes: attributes});
  } catch (err) {
    ctx.error("error creating profile", {error: err});
  }
});

export const authOnDelete = onUserDeleted(options, async (event) => {
  const user = event.data;
  const ctx = Context.get();
  ctx.info("starting sync", {user: user});

  try {
    await ctx.destroy(user.uid);
    ctx.info("deleted profile", {customer_id: user.uid});
  } catch (err) {
    ctx.error("error deleting profile", {error: err});
  }
});

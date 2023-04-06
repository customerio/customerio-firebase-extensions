import * as functions from "firebase-functions";
import { Context } from "./context";
import { ErrorDetail, Result, UserRecord } from "./types";

export function buildUserRecord(ctx: Context, documentId: string, data: functions.firestore.DocumentSnapshot): Result<UserRecord, ErrorDetail> {
  let identifiers = data.get("identifiers") || {};
  const attributes = data.get("attributes") || {};

  ctx.info("building user record", {
    data: data.data(),
    identifiers:identifiers,
    attributes:attributes,
  });

  const numIdentifiers = Object.keys(identifiers).length;

  if ( numIdentifiers == 0 ) {
    identifiers = { id: documentId };
  } else if ( numIdentifiers > 1 ) {
    return {value: null, error: {
      type: "invalid",
      field: "identifiers",
      message: "must provide only one of id or email",
    }};
  }

  let allowedIdentifier = false;
  let emailIdentifier = false;
  Object.keys(identifiers).forEach((key) => {
    if ( key.toLowerCase() === "id" || key.toLowerCase() === "email" ) {
      allowedIdentifier = true;
      emailIdentifier = key.toLowerCase() === "email";
    }
  });

  if ( !allowedIdentifier ) {
    return {value: null, error: {
      type: "invalid",
      field: "identifiers",
      message: "must provide one of id or email",
    }};
  }

  if ( emailIdentifier && !attributes.hasOwnProperty("id") ) {
    attributes["id"] = documentId;
  }

  const record: UserRecord = {
    identifiers: identifiers,
    attributes: attributes,
  };

  return {value: record, error: null};
}

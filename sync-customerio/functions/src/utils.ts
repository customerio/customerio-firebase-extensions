import * as functions from "firebase-functions";
import { Context } from "./context";
import { ErrorDetail, Result, UserRecord } from "./types";

export function buildUserRecord(ctx: Context, documentId: string, data: functions.firestore.DocumentSnapshot): Result<UserRecord, ErrorDetail> {
  let identifiers = data.get("identifiers") || {};
  const attributes = data.get("attributes") || {};

  ctx.info("building user record", {
    data: data.data(),
    identifiers,
    attributes,
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
  let emailID = "";
  let ID = "";
  Object.keys(identifiers).forEach((key) => {
    if ( key.toLowerCase() === "id" ) {
      allowedIdentifier = true;
      ID = identifiers[key];
    } else if ( key.toLowerCase() === "email" ) {
      allowedIdentifier = true;
      emailID = identifiers[key];
    }
  });

  if ( !allowedIdentifier ) {
    return {value: null, error: {
      type: "invalid",
      field: "identifiers",
      message: "must provide one of id or email",
    }};
  }

  if ( emailID != "" && !attributes.hasOwnProperty("id") ) {
    attributes["id"] = documentId;
  }

  const record: UserRecord = {
    identifier: {
      type: emailID !== "" ? "email" : "id",
      value: emailID !== "" ? emailID: ID,
    },
    attributes: attributes,
  };

  return {value: record, error: null};
}

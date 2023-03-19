import * as functions from "firebase-functions";

import {TrackClient, RegionUS, RegionEU} from "customerio-node";

const SITE_ID = process.env.CIO_SITE_ID;
const API_KEY = process.env.CIO_API_KEY;
const REGION = process.env.CIO_REGION == "us" ? RegionUS : RegionEU;
const IDENTIFIER = process.env.CIO_IDENTIFIER;

const cio = new TrackClient(SITE_ID, API_KEY, {region: REGION});

export const createProfile = functions.auth.user().onCreate(async (user) => {
  functions.logger.log("Firebase user created", user);

  let id = "";
  if (IDENTIFIER == "id" && user.uid != null && user.uid != "") {
    id = user.id;
  }
  if (IDENTIFIER == "email" && user.email != null && user.email != "") {
    id = user.email;
  }

  if (id=="") {
    functions.logger.error("can't create CIO profile without uid or email");
    return;
  }

  cio.identify(id, {}).then(
      () => {
        functions.logger.log("created", {id});
      },
      (err) => {
        functions.logger.error("create failed", err);
      },
  );
});

export const deleteProfile = functions.auth.user().onDelete(async (user) => {
  functions.logger.log("Firebase user deleted", user);

  let id = "";
  if (IDENTIFIER == "id" && user.uid != null && user.uid != "") {
    id = user.id;
  }
  if (IDENTIFIER == "email" && user.email != null && user.email != "") {
    id = user.email;
  }

  if (id=="") {
    functions.logger.error("can't delete CIO profile without uid or email");
    return;
  }

  cio.destroy(id, {}).then(
      () => {
        functions.logger.log("deleted", {id});
      },
      (err) => {
        functions.logger.error("delete failed", err);
      },
  );
});

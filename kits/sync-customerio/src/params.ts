import { defineSecret, defineString, select } from "firebase-functions/params";

// Names match the sync-customerio extension params so `firebase ext:migrate` carries values over.

export const LOCATION = defineString("LOCATION", {
  label: "Cloud Functions location",
  description: "Where to deploy the functions. See https://firebase.google.com/docs/functions/locations.",
  default: "us-central1",
  input: select([
    "us-central1", "us-east1", "us-east4", "us-west2", "us-west3", "us-west4",
    "europe-central2", "europe-west1", "europe-west2", "europe-west3", "europe-west6",
    "asia-east1", "asia-east2", "asia-northeast1", "asia-northeast2", "asia-northeast3",
    "asia-south1", "asia-southeast1", "asia-southeast2",
    "northamerica-northeast1", "southamerica-east1", "australia-southeast1",
  ]),
});

export const SITE_ID = defineString("SITE_ID", {
  label: "Customer.io Site ID",
  description: "Found on your API Credentials page: https://fly.customer.io/settings/api_credentials",
  input: { text: { validationRegex: "^\\S+$", validationErrorMessage: "Site ID cannot contain spaces." } },
});

export const API_KEY = defineSecret("API_KEY", {
  description: "Customer.io Track API key, found on your API Credentials page: https://fly.customer.io/settings/api_credentials",
});

export const REGION = defineString("REGION", {
  label: "Customer.io Datacenter Region",
  description: "Must match your account's region, shown on https://fly.customer.io/settings/privacy",
  default: "us",
  input: select({ US: "us", EU: "eu" }),
});

export const USERS_COLLECTION = defineString("USERS_COLLECTION", {
  label: "Firestore collection of user records to sync",
  description: "A collection path to monitor for changes. Setting to an unused collection name disables the sync.",
  default: "_unconfigured_",
});

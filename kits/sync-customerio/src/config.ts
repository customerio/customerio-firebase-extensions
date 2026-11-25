import { RegionUS, RegionEU } from "customerio-node";
import { Config } from "./types";
import { API_KEY, REGION, SITE_ID, USERS_COLLECTION } from "./params";

// Must only be called at runtime: secret params can't be read during deploy.
export function loadConfig(): Config {
  const eu = REGION.value() == "eu";

  return {
    site_id: SITE_ID.value(),
    api_key: API_KEY.value(),
    region: eu ? RegionEU : RegionUS,
    region_name: eu ? "eu" : "us",
    collection: USERS_COLLECTION.value(),
  };
};

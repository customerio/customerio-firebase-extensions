import { Region, RegionUS, RegionEU } from "customerio-node";
import { Config, Environment } from "./types";
import { API_KEY, REGION, SITE_ID, USERS_COLLECTION } from "./params";

// Must only be called at runtime: secret params can't be read during deploy.
export function loadConfig(): Config {
  const config: Config = {
    site_id: SITE_ID.value(),
    api_key: API_KEY.value(),
    region: RegionUS,
    region_name: "us",
    collection: USERS_COLLECTION.value(),
    environment: Environment.Prod,
  };

  if ( REGION.value() == "eu" ) {
    config.region = RegionEU;
    config.region_name = "eu";
  }

  // Internal-only override for testing against a local Customer.io stack; not a declared param.
  if ( process.env.ENVIRONMENT == Environment.Dev ) {
    config.environment = Environment.Dev;
    config.region = new Region("https://track.local.customerio.dev/api/v1", "https://api.local.customerio.dev/v1");
    config.region_name = "dev";
  }

  return config;
};

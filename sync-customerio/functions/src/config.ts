import { Region, RegionUS, RegionEU } from "customerio-node";
import { Config, Environment } from "./types";

export function loadConfig(): Config {
  let config: Config = {
    site_id: "",
    api_key: "",
    region: RegionUS,
    collection: "",
    environment: Environment.Prod,
  };

  if ( process.env.SITE_ID ) {
    config.site_id = process.env.SITE_ID;
  }

  if ( process.env.API_KEY ) {
    config.api_key = process.env.API_KEY;
  }

  if ( process.env.Region == "eu" ) {
    config.region = RegionEU;
  }

  if ( process.env.USERS_COLLECTION ) {
    config.collection = process.env.USERS_COLLECTION;
  }

  if ( process.env.ENVIRONMENT == Environment.Dev ) {
    config.environment = Environment.Dev;
    config.region = new Region('https://track.local.customerio.dev/api/v1', 'https://api.local.customerio.dev/v1');
  }

  if ( process.env.ENVIRONMENT == Environment.Test ) {
    config.environment = Environment.Test;
  }

  return config;
};

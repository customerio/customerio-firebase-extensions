import { logger } from "firebase-functions";
import { TrackClient } from "customerio-node";
import { Config, Logger } from "./types";
import { loadConfig } from "./config";

export class Context {
  private static instance: Context;

  config: Config;
  client: TrackClient;
  logger: Logger;

  private constructor() {
    this.config = loadConfig();
    this.logger = logger;
    this.client = new TrackClient(this.config.site_id, this.config.api_key, {region: this.config.region});

    const redactedConfig = Object.assign({}, this.config, {
      site_id: "<redacted>",
      api_key: "<redacted>",
    });

    this.info("initialized context", {config: redactedConfig});
  }

  static get(): Context {
    if ( !Context.instance ) {
      Context.instance = new Context();
    }
    return Context.instance;
  }

  info(message: string, ...args: any[]) {
    this.logger.info(message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.logger.error(message, ...args);
  }

  identify(customerId: string | number, data: any = {}): Promise<any> {
    return this.client.identify(customerId, data);
  }

  destroy(customerId: string | number): Promise<any> {
    return this.client.destroy(customerId);
  }
};

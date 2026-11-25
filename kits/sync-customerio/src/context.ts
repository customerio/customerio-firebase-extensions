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

    // Logged so a mismatched REGION is easy to spot when syncs start failing with auth errors.
    this.info("initialized context", {
      region: this.config.region_name,
      collection: this.config.collection,
    });
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

  // Error's message and stack aren't enumerable, so the structured logger would drop them.
  static describeError(err: unknown): { error: string, status?: number } {
    return { error: String(err), status: (err as { statusCode?: number })?.statusCode };
  }

  identify(customerId: string | number, data: any = {}): Promise<any> {
    return this.client.identify(customerId, data);
  }

  destroy(customerId: string | number): Promise<any> {
    return this.client.destroy(customerId);
  }
};

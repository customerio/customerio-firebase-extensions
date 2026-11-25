import type { Region } from "customerio-node";

export interface Logger {
  info(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
};

export type Config = {
  site_id: string;
  api_key: string;
  region: Region;
  region_name: string;

  collection: string;
};

export type UserRecord = {
  identifier: {
    type: string;
    value: string;
  };

  attributes: {
    [key: string]: any;
  };
};

export type ErrorDetail = {
  type: string;
  field: string;
  message: string;
};

export type Result<T, E> = { value: T, error: null } | { value: null; error: E };

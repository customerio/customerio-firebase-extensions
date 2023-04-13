import type { Region } from "customerio-node";

export interface Logger {
  info(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
};

export enum Environment {
  Prod = 'prod',
  Dev  = 'dev',
  Test = 'test',
};

export type Config = {
  // cio library options
  site_id: string;
  api_key: string;
  region: Region;

  // extension options
  collection: string;
  environment: Environment;
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

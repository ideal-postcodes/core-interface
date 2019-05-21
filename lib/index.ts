/**
 * Constants
 */
export const API_URL = "api.ideal-postcodes.co.uk";
export const TLS = true;
export const VERSION = "v1";
export const TIMEOUT = 10000;

/*
 * STRICT_AUTHORISATION forces authorization header usage on
 * autocomplete API which increases latency due to overhead
 * OPTIONS request
 */
export const STRICT_AUTHORISATION = false;

export { Client } from "./client";

export { Agent, HttpRequest, HttpResponse } from "./agent";

import { Address } from "../node_modules/@ideal-postcodes/api-typings";

import * as errors from "./error";
export { errors };

interface Authenticable {
  api_key?: string;
  licensee?: string;
}

interface ResponseFilterable {
  filter?: keyof Address[];
}

interface Taggable {
  tags?: string[];
}

interface Paginateable {
  page?: number;
}

export interface LookupPostcodeOptions
  extends Authenticable,
    ResponseFilterable,
    Taggable,
    Paginateable {
  postcode: string;
}

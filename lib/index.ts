/**
 * Constants
 */

/**
 * Default API endpoint
 */
export const API_URL = "api.ideal-postcodes.co.uk";
/**
 * Use TLS by default. Set to `true`
 */
export const TLS = true;
/**
 * Default API Version number. Defaults to "v1"
 */
export const VERSION = "v1";
/**
 * Default HTTP timeout in milliseconds. Defaults to 10s
 */
export const TIMEOUT = 10000;
/*
 * STRICT_AUTHORISATION forces authorization header usage on
 * autocomplete API which increases latency due to overhead
 * OPTIONS request
 */
export const STRICT_AUTHORISATION = false;

export { Client, Config } from "./client";

export { Agent, HttpRequest, HttpResponse } from "./agent";

import * as errors from "./error";
export { errors };

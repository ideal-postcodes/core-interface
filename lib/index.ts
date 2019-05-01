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

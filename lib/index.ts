/**
 * @module Exports
 *
 * @description Direct exports of core-interface
 */

export { Client, Config, defaults } from "./client";
export { Agent, HttpRequest, HttpResponse } from "./agent";
export * from "./helpers";
export * from "./types";
import * as addresses from "./resources/addresses";
import * as autocomplete from "./resources/autocomplete";
import * as keys from "./resources/keys";
import * as postcodes from "./resources/postcodes";
import * as udprn from "./resources/udprn";
import * as umprn from "./resources/umprn";
import * as errors from "./error";

export { addresses, autocomplete, keys, postcodes, udprn, umprn, errors };

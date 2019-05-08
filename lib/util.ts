import { Client } from "./client";

export interface OptionalStringMap {
  [key: string]: string | undefined;
}

import { StringMap } from "./agent";

/**
 * toQuery
 *
 * Shallow copies object while omitting undefined attributes
 */
export const toStringMap = (optional?: OptionalStringMap): StringMap => {
  if (optional === undefined) return {};
  return Object.keys(optional).reduce<StringMap>((result, key) => {
    const value = optional[key];
    if (isString(value)) result[key] = value;
    return result;
  }, {});
};

const isString = (i: any): i is string => typeof i === "string";

interface OptionalTimeout {
  timeout?: number;
}

const isNumber = (n: any): n is number => typeof n === "number";

/**
 * toTimeout
 *
 * Returns timeout value from request object. Delegates to default client
 * timeout if not specified
 */
export const toTimeout = ({ timeout }: OptionalTimeout, client: Client) => {
  if (isNumber(timeout)) return timeout;
  return client.timeout;
};

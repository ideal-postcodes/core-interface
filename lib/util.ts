export interface OptionalStringMap {
  [key: string]: string | undefined;
}

import { StringMap } from "./agent";

/**
 * toQuery
 *
 * Shallow copies object while omitting undefined attributes
 */
export const toStringMap = (optional: OptionalStringMap): StringMap => {
  return Object.keys(optional).reduce<StringMap>((result, key) => {
    const value = optional[key];
    if (isString(value)) result[key] = value;
    return result;
  }, {});
};

const isString = (i: any): i is string => typeof i === "string";

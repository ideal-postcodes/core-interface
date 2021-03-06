/**
 * @module Utils
 */

import { Client } from "./client";
import { Header } from "./agent";
import {
  Authenticable,
  Paginateable,
  AdminAuthenticable,
  Taggable,
  HttpOptions,
  Filterable,
  QueryValue,
} from "./types";

export interface OptionalStringMap {
  [key: string]: QueryValue;
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
    const value: QueryValue = optional[key];
    const reduce = reduceStringMap(value);
    if (reduce.length > 0) result[key] = reduce;
    return result;
  }, {});
};

const isString = (i: unknown): i is string => typeof i === "string";

const isArray = (i: unknown): i is unknown[] => Array.isArray(i);

const reduceStringMap = (value: QueryValue): string => {
  const result: string[] = [];
  if (isArray(value)) {
    value.forEach((val) => {
      if (isNumber(val)) result.push(val.toString());
      if (isString(val)) result.push(val);
    });
    return result.join(",");
  }
  if (isNumber(value)) return value.toString();
  if (isString(value)) return value;
  return "";
};

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
export const toTimeout = (
  { timeout }: OptionalTimeout,
  client: Client
): number => {
  if (isNumber(timeout)) return timeout;
  return client.config.timeout;
};

interface OptionalHeader {
  header?: OptionalStringMap;
}

/**
 * toHeader
 *
 * Extracts HTTP Header object from request and client default headers
 *
 * Precendence is given to request specific headers
 */
export const toHeader = (
  { header = {} }: OptionalHeader,
  client: Client
): Header => {
  return { ...client.config.header, ...toStringMap(header) };
};

type Credentials = [string, string][];

type AuthenticationOptions = Partial<Authenticable & AdminAuthenticable>;

/**
 * toAuthHeader
 *
 * Extracts credentials into authorization header format
 */
export const toAuthHeader = (
  client: Client,
  options: AuthenticationOptions
): string => {
  const credentials: Credentials = [];

  const api_key = options.api_key || client.config.api_key;
  credentials.push(["api_key", api_key]);

  const licensee = options.licensee;
  if (licensee !== undefined) credentials.push(["licensee", licensee]);

  const user_token = options.user_token;
  if (user_token !== undefined) credentials.push(["user_token", user_token]);

  return `IDEALPOSTCODES ${toCredentialString(credentials)}`;
};

interface AppendAuthorizationOptions {
  options: AuthenticationOptions;
  client: Client;
  header: StringMap;
}

interface AppendAuthorization {
  (options: AppendAuthorizationOptions): StringMap;
}
/**
 * appendAuthorization
 *
 * Mutates a headers object to include Authorization header. Will insert if found:
 * - api_key
 * - licensee
 * - user_token
 */
export const appendAuthorization: AppendAuthorization = ({
  header,
  options,
  client,
}) => {
  header.Authorization = toAuthHeader(client, options);
  return header;
};

const toCredentialString = (credentials: Credentials): string => {
  return credentials.map(([key, value]) => `${key}="${value}"`).join(" ");
};

interface AppendIpOptions {
  header: StringMap;
  options: HttpOptions;
}

// Adds source IP to headers
export const appendIp = ({ header, options }: AppendIpOptions): StringMap => {
  const { sourceIp } = options;
  if (sourceIp !== undefined) header["IDPC-Source-IP"] = sourceIp;
  return header;
};

interface AppendFilterOptions {
  query: StringMap;
  options: Filterable;
}

// Adds filters to query
export const appendFilter = ({
  query,
  options,
}: AppendFilterOptions): StringMap => {
  const { filter } = options;
  if (filter !== undefined) query.filter = filter.join(",");
  return query;
};

interface AppendTagsOptions {
  client: Client;
  query: StringMap;
  options: Taggable;
}

// Adds tags to query
export const appendTags = ({
  client,
  query,
  options,
}: AppendTagsOptions): StringMap => {
  let tags: string[] | undefined;
  if (client.config.tags.length) tags = client.config.tags;
  if (options.tags) tags = options.tags;
  if (tags !== undefined) query.tags = tags.join(",");
  return query;
};

interface AppendPageOptions {
  query: StringMap;
  options: Paginateable;
}

// Adds pagination attributes to query
export const appendPage = ({
  query,
  options,
}: AppendPageOptions): StringMap => {
  const { page, limit } = options;
  if (page !== undefined) query.page = page.toString();
  if (limit !== undefined) query.limit = limit.toString();
  return query;
};

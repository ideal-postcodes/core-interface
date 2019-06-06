import { Client } from "./client";
import { Header } from "./agent";
import {
  Authenticable,
  AdminAuthenticable,
  Taggable,
  HttpOptions,
  Filterable,
} from "./types";

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
export const toTimeout = (
  { timeout }: OptionalTimeout,
  client: Client
): number => {
  if (isNumber(timeout)) return timeout;
  return client.timeout;
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
  return { ...client.header, ...toStringMap(header) };
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

  const api_key = options.api_key || client.api_key;
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
  query: StringMap;
  options: Taggable;
}

// Adds tags to query
export const appendTags = ({
  query,
  options,
}: AppendTagsOptions): StringMap => {
  const { tags } = options;
  if (tags !== undefined) query.tags = tags.join(",");
  return query;
};

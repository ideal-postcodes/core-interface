/**
 * @module Helper Methods
 */

import * as addresses from "./resources/addresses";
import * as keys from "./resources/keys";
import * as postcodes from "./resources/postcodes";
import * as udprn from "./resources/udprn";
import * as umprn from "./resources/umprn";
import { HttpResponse, StringMap } from "./agent";
import { Request as BaseRequest } from "./resources/resource";
import {
  appendAuthorization,
  appendPage,
  appendIp,
  appendFilter,
  appendTags,
} from "./util";
import {
  IdpcPostcodeNotFoundError,
  IdpcUmprnNotFoundError,
  IdpcUdprnNotFoundError,
} from "./error";
import {
  UkAddress,
  PafAddress,
  NybAddress,
  MrAddress,
  KeyStatus,
} from "./types";
import {
  Authenticable,
  Filterable,
  Taggable,
  HttpOptions,
  Paginateable,
} from "./types";
import { Client } from "./client";

interface Request extends BaseRequest {
  query: StringMap;
  header: StringMap;
}

/**
 * ID lookup options interface
 */
export interface LookupIdOptions
  extends Authenticable,
    Filterable,
    Taggable,
    HttpOptions {
  /**
   * Client instance
   */
  client: Client;
}

/**
 * Address search options
 */
export interface LookupAddressOptions
  extends Authenticable,
    Filterable,
    Taggable,
    Paginateable,
    HttpOptions {
  /**
   * Client instance
   */
  client: Client;
  /**
   * Query string for address
   *
   * @example "10 downing street"
   */
  query: string;
}

/**
 * Postcode lookup options
 */
export interface LookupPostcodeOptions extends LookupIdOptions {
  /**
   * Client instance
   */
  client: Client;
  /**
   * Postcode to query for. Space and case insensitive
   */
  postcode: string;
  /**
   * With multiple residence datasets, a very small number of postcodes will
   * yield more than 100 results. In this instance, you would need to paginate
   * through them with `page`
   */
  page?: number;
}

/**
 * UDPRN lookup options
 */
export interface LookupUdprnOptions extends LookupIdOptions {
  /**
   * Client instance
   */
  client: Client;
  /**
   * UDPRN to query for
   */
  udprn: number;
}

/**
 * UMPRN lookup options
 */
export interface LookupUmprnOptions extends LookupIdOptions {
  /**
   * Client instance
   */
  client: Client;
  /**
   * UMPRN to query for
   */
  umprn: number;
}

/**
 * Check key usab ility options
 */
export interface CheckKeyUsabilityOptions extends HttpOptions {
  /**
   * Client instance
   */
  client: Client;
  /**
   * If api_key is supplied, this will overwrite the key defined during client instantiation
   */
  api_key?: string;
  /**
   * Checks API Key and licensee combination. This checks whether a particular
   * licensee can use the API
   */
  licensee?: string;
}

/**
 * Ping API base (`/`)
 *
 * Dispatches HTTP request to root endpoint "`/`"
 */
export const ping = (client: Client): Promise<HttpResponse> => {
  const method = "GET";
  const url = `${client.protocol()}://${client.config.baseUrl}/`;
  return client.config.agent.http({
    method,
    url,
    header: {},
    query: {},
    timeout: client.config.timeout,
  });
};

/**
 * Lookup Postcode
 *
 * Search for addresses given a postcode. Postcode queries are case and space insensitive
 *
 * Invalid postcodes return an empty array address result `[]`
 *
 * [API Documentation for /postcodes](https://ideal-postcodes.co.uk/documentation/postcodes#postcode)
 */
export const lookupPostcode = (
  options: LookupPostcodeOptions
): Promise<UkAddress[]> => {
  const queryOptions = toAddressIdQuery(options);

  const { page } = options;
  if (page !== undefined) queryOptions.query.page = page.toString();

  return postcodes
    .retrieve(options.client, options.postcode, queryOptions)
    .then((response) => response.body.result)
    .catch((error) => {
      if (error instanceof IdpcPostcodeNotFoundError) return [];
      throw error;
    });
};

/**
 * Lookup Address
 *
 * Search for an address given a query
 *
 * [API Documentation for /addresses](https://ideal-postcodes.co.uk/documentation/addresses#query)
 */
export const lookupAddress = (
  options: LookupAddressOptions
): Promise<UkAddress[]> => {
  const queryOptions = toAddressLookupQuery(options)

  return addresses
    .list(options.client, queryOptions)
    .then((response) => response.body.result.hits);
};

/**
 * Generates a request object. Bundles together commonly used header/query extractions:
 * - Authorization (api_key, licensee, user_token)
 * - Source IP forwarding
 * - Result filtering
 * - Tagging
 */
export const toAddressIdQuery = (options: LookupIdOptions): Request => {
  const header: StringMap = {};
  const query: StringMap = {};
  const { client } = options;

  appendAuthorization({ client, header, options });
  appendIp({ header, options });
  appendFilter({ query, options });
  appendTags({ client, query, options });

  const request: Request = { header, query };
  if (options.timeout !== undefined) request.timeout = options.timeout;

  return request;
};


export const toAddressLookupQuery = (options: LookupAddressOptions): Request => {
  const header: StringMap = {};
  const query: StringMap = { query: options.query }
  const { client } = options;

  appendAuthorization({ client, header, options });
  appendIp({ header, options });
  appendFilter({ query, options });
  appendTags({ client, query, options });
  appendPage({ query, options });

  const queryOptions: Request = { header, query };
  if (options.timeout !== undefined) queryOptions.timeout = options.timeout;

  return queryOptions;
};
/**
 * Lookup UDPRN
 *
 * Search for an address given a UDPRN
 *
 * Invalid UDPRN returns `null`
 *
 * [API Documentation for /udprn](https://ideal-postcodes.co.uk/documentation/udprn)
 */
export const lookupUdprn = (
  options: LookupUdprnOptions
): Promise<PafAddress | NybAddress | null> => {
  const queryOptions = toAddressIdQuery(options);
  return udprn
    .retrieve(options.client, options.udprn.toString(), queryOptions)
    .then((response) => response.body.result)
    .catch((error) => {
      if (error instanceof IdpcUdprnNotFoundError) return null;
      throw error;
    });
};

/**
 * Lookup UMPRN
 *
 * Search for an address given a UDPRN
 *
 * Invalid UDPRN returns `null`
 *
 * [API Documentation for /udprn](https://ideal-postcodes.co.uk/documentation/udprn)
 */
export const lookupUmprn = (
  options: LookupUmprnOptions
): Promise<MrAddress | null> => {
  const queryOptions = toAddressIdQuery(options);
  return umprn
    .retrieve(options.client, options.umprn.toString(), queryOptions)
    .then((response) => response.body.result)
    .catch((error) => {
      if (error instanceof IdpcUmprnNotFoundError) return null;
      throw error;
    });
};

/**
 * Check Key Availability
 *
 * Checks if a key can bey used
 *
 * [API Documentation for /keys]()https://ideal-postcodes.co.uk/documentation/keys#key)
 */
export const checkKeyUsability = (
  options: CheckKeyUsabilityOptions
): Promise<KeyStatus> => {
  const { client, timeout } = options;
  const api_key = options.api_key || options.client.config.api_key;
  const { licensee } = options;
  let query;
  if (licensee === undefined) {
    query = {};
  } else {
    query = { licensee };
  }

  const queryOptions: Request = { query, header: {} };
  if (timeout !== undefined) queryOptions.timeout = timeout;
  return keys
    .retrieve(client, api_key, queryOptions)
    .then((response) => response.body.result as KeyStatus); // Assert that we're retrieving public key information as no user_token provided
};

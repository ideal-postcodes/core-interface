/**
 * @module Misc Types
 */

import { Address } from "@ideal-postcodes/api-typings";

/**
 * Authenticable
 *
 * If options require authentication
 */
export interface Authenticable {
  /**
   * Providing an api_key will overwrite the api_key embedded in the client
   */
  api_key?: string;
  /**
   * If the request is made by a licensee, this should be included here
   */
  licensee?: string;
}

/**
 * AdminAuthenticable
 *
 * If options require a user token
 */
export interface AdminAuthenticable {
  /**
   * For sensitive API operations, such as viewing key usage, a user_token is required
   */
  user_token: string;
}

/**
 * Address object attributes
 */
export type AddressKeys = keyof Address;

/**
 * Filterable
 *
 * Filter result for specific attribute, e.g. "line_1", "postcode", "organisation_name"
 */
export interface Filterable {
  /**
   * You can reduce the size of the response payload selecting for only the attributes you want to see
   *
   * @example
   *
   * ```javascript
   * {
   *   filter: ["line_1", "line_2", "line_3", "post_town", "postcode"],
   * }
   * ```
   */
  filter?: AddressKeys[];
}

/**
 * HttpOptions
 *
 * Basic HTTP options
 */
export interface HttpOptions {
  /**
   * For node.js client only, you can forward an IP address to be rate limited. Useful for backend integrations where the API would only see your application server IP addresses
   *
   * This header will not be applied on browser requests as IDPC-Source-IP is not listed as an allowed header
   */
  sourceIp?: string;

  /**
   * Overwrite the default HTTP request timeout defined in client
   */
  timeout?: number;
}

/**
 * Taggable
 *
 * Request can be tagged with up to 5 tags (no longer than 16 characters each)
 */
export interface Taggable {
  /**
   * Submit tags to annotate paid API requests for retrieve and aggregation later
   *
   * Restrictions:
   * - You may only specify up to 5 tags per API request
   * - Each tag must not be longer than 16 UTF-8 characters
   *
   * [Tagging & Metadata API Documentation](https://ideal-postcodes.co.uk/documentation/metadata)
   */
  tags?: string[];
}

/**
 * Paginateable
 *
 * Some requests can be paginated, e.g. address search and multiple residence
 * postcode lookup
 */
export interface Paginateable {
  /**
   * Page number. Zero based index
   */
  page?: number;
  /**
   * Maximum number of results per page
   */
  limit?: number;
}

/**
 * QueryValue
 */
export type QueryValue = undefined | number | string | (string | number)[];

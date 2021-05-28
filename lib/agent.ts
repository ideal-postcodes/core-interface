/**
 * Agent
 *
 * This module specifies the interface for the HTTP agent required by the bare
 * client library
 */

/**
 * Agent
 *
 * The sole requirement of this class is to implement a JSON request method
 * that supports HTTP attributes defined in `HttpRequest`
 *
 * The underlying implementation (i.e. whether it uses node's `http` module,
 * or browser XHR) is the responsibility of downstream client implementations.
 * Namely @ideal-postcodes/core-browser and @ideal-postcodes/core-node
 *
 * @example
 *
 * ```javascript
 * class AxiosAgent implements Agent {
 *   public http(options) {
 *     return axios.request(options);
 *   }
 * }
 * ```
 */
export interface Agent {
  http: Http;
}

/**
 * Request
 *
 * Dispatches HTTP JSON http request
 */
export interface Http {
  (httpRequest: HttpRequest): Promise<HttpResponse>;
}

export type HttpVerb = "GET" | "POST" | "DELETE" | "PUT" | "PATCH" | "DELETE";

/**
 * HttpRequest
 *
 * Describes HTTP request
 */
export interface HttpRequest {
  // HTTP method to invoke
  method: HttpVerb;
  // JSON request body
  body?: any;
  // Time in milliseconds before request times out
  timeout: number;
  // Base URL to hit (includes protocol, hostname and prefixing path)
  url: string;
  // String map which represents HTTP headers to send
  header: Header;
  // String map which represents query strings to attach to URL
  query: Query;
}

export type StringMap = Record<string, string>;

/**
 * Header
 */
export type Header = StringMap;
export type Query = StringMap;

/**
 * Metadata
 *
 * Stores any meta data that an agent may decide to decorate the response with
 *
 * E.g. for a browser client, the agent could add an XMLHttpRequest object
 */
interface Metadata {
  [key: string]: unknown;
}

/**
 * HttpResponse
 *
 * Represents HTTP Response of request
 */
export interface HttpResponse {
  // HTTP status code
  httpStatus: number;
  // HTTP response headers
  header: Header;
  // JSON response body
  body: any;
  // Original HTTP request
  httpRequest: HttpRequest;
  // Any additional meta data, e.g. XMLHttpRequest objects
  metadata?: Metadata;
}

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
 *   public http(options, callback) {
 *     axios.request(options)
 *      .then(response => callback(undefined, response))
 *      .catch(error => callback(error));
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
  (httpRequest: HttpRequest, callback: HttpCallback): void;
}

type HttpVerb = "GET" | "POST" | "DELETE" | "PUT" | "PATCH" | "DELETE";

/**
 * HttpRequest
 *
 * Describes HTTP request
 */
export interface HttpRequest {
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

interface StringMap {
  [key: string]: string;
}

type Header = StringMap;
type Query = StringMap;

export interface HttpCallback {
  (error: undefined | Error, response: HttpResponse): void;
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
  headers: Header;
  // JSON response body
  body: any;
  // Original HTTP request
  httpRequest: HttpRequest;
}

/**
 * Agent
 *
 * This module specifies the interface for the HTTP agent required by the bare
 * client library
 */

/**
 * Agent
 *
 * Object that exports a HTTP `http` method
 */
export interface Agent {
  http: Http;
}

/**
 * Request
 *
 * Dispatches HTTP request
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
  body?: any;
  timeout: number;
  url: string;
  header: Header;
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
  httpStatus: number;
  headers: Header;
  body: any;
  httpRequest: HttpRequest;
}

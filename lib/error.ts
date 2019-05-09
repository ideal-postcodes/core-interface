import { HttpResponse } from "./agent";
import { ApiErrorResponse } from "../node_modules/@ideal-postcodes/api-typings";

/**
 * IdealPostcodesErrorOptions
 *
 * IdealPostcodesError requires only a HTTP status from a failed API request
 */
interface IdealPostcodesErrorOptions {
  message: string;
  httpStatus: number;
}

// Take note of https://github.com/Microsoft/TypeScript/issues/13965

/**
 * IdealPostcodesError
 *
 * Base error class for all API responses that return an error. This class
 * is used where a JSON body is not provided or invalid
 * E.g. 503 rate limit response, JSON parse failure response
 */
export class IdealPostcodesError extends Error {
  __proto__: Error;

  public httpStatus: number;

  /**
   * Instantiate IdealPostcodesError
   */
  constructor(options: IdealPostcodesErrorOptions) {
    const trueProto = new.target.prototype;
    super();
    this.__proto__ = trueProto;

    const { message, httpStatus } = options;
    this.message = message;
    this.name = "Ideal Postcodes Error";
    this.httpStatus = httpStatus;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IdealPostcodesError);
    }
  }
}

/**
 * IdpcApiError
 *
 * Base error class for API responses with a JSON body. Typically a subclass
 * will be used to capture the error category (e.g. 400, 401, 500, etc)
 */
export class IdpcApiError extends IdealPostcodesError {
  /**
   * Raw HTTP response
   */
  public response: HttpResponse;

  /**
   * Returns an API error instance
   */
  constructor(httpResponse: HttpResponse) {
    super({
      httpStatus: httpResponse.httpStatus,
      message: httpResponse.body.message,
    });
    this.response = httpResponse;
  }
}

/**
 * IdpcBadRequestError
 *
 * Captures API responses that return a 400 (Bad Request Error) response
 *
 * Examples include:
 * - Invalid syntax submitted
 * - Invalid date range submitted
 * - Invalid tag submitted
 */
export class IdpcBadRequestError extends IdpcApiError {}

/**
 * IdpcUnauthorisedError
 *
 * Captures API responses that return a 401 (Unauthorised) response
 *
 * Examples include:
 * - Invalid api_key
 * - Invalid user_token
 * - Invalid licensee
 */
export class IdpcUnauthorisedError extends IdpcApiError {}

/**
 * IdpcRequestFailedError
 *
 * Captures API responses that return a 402 (Request Failed) response
 *
 * Examples include:
 * - Key balance depleted
 * - Daily key limit reached
 */
export class IdpcRequestFailedError extends IdpcApiError {}

/**
 * IdpcResourceNotFoundError
 *
 * Captures API responses that return a 404 (Resource Not Found) response
 *
 * Examples include:
 * - Postcode not found
 * - UDPRN not found
 * - Key not found
 */
export class IdpcResourceNotFoundError extends IdpcApiError {}

/**
 * IdpcPostcodeNotFoundError
 *
 * Requested postcode does not exist
 */
export class IdpcPostcodeNotFoundError extends IdpcResourceNotFoundError {}

/**
 * IdpcKeyNotFoundError
 *
 * Requested API Key does not exist
 */
export class IdpcKeyNotFoundError extends IdpcResourceNotFoundError {}

/**
 * IdpcUdprnNotFoundError
 *
 * Requested UDPRN does not exist
 */
export class IdpcUdprnNotFoundError extends IdpcResourceNotFoundError {}

/**
 * IdpcUmprnNotFoundError
 *
 * Requested UMPRN does not exist
 */
export class IdpcUmprnNotFoundError extends IdpcResourceNotFoundError {}

/**
 * IdpcServerError
 *
 * Captures API responses that return a 500 (Server Error) response
 */
export class IdpcServerError extends IdpcApiError {}

const OK = 200;
const REDIRECT = 300;
const BAD_REQUEST = 400;
const UNAUTHORISED = 401;
const PAYMENT_REQUIRED = 402;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const INVALID_KEY = 4010;
const POSTCODE_NOT_FOUND = 4040;
const UDPRN_NOT_FOUND = 4044;
const UMPRN_NOT_FOUND = 4046;

const isSuccess = (code: number): boolean => {
  if (code < OK) return false;
  if (code >= REDIRECT) return false;
  return true;
};

const isObject = (o: unknown): o is object => {
  if (o === null) return false;
  if (typeof o !== "object") return false;
  return true;
};

const isErrorResponse = (body: unknown): body is ApiErrorResponse => {
  if (!isObject(body)) return false;
  if (typeof (body as ApiErrorResponse).message !== "string") return false;
  if (typeof (body as ApiErrorResponse).code !== "number") return false;
  return true;
};

/**
 * parse
 *
 * Parses API responses and returns an error for non 2xx responses
 *
 * Upon detecting an error an instance of IdealPostcodesError is returned
 */
export const parse = (response: HttpResponse): Error | void => {
  const { httpStatus, body } = response;

  if (isSuccess(httpStatus)) return;

  if (isErrorResponse(body)) {
    // Test for specific API errors of interest
    const { code } = body;
    if (code === INVALID_KEY) return new IdpcKeyNotFoundError(response);
    if (code === POSTCODE_NOT_FOUND)
      return new IdpcPostcodeNotFoundError(response);
    if (code === UDPRN_NOT_FOUND) return new IdpcUdprnNotFoundError(response);
    if (code === UMPRN_NOT_FOUND) return new IdpcUmprnNotFoundError(response);

    // If no API errors of interest detected, fall back to http status code
    if (httpStatus === NOT_FOUND)
      return new IdpcResourceNotFoundError(response);
    if (httpStatus === BAD_REQUEST) return new IdpcBadRequestError(response);
    if (httpStatus === PAYMENT_REQUIRED)
      return new IdpcRequestFailedError(response);
    if (httpStatus === UNAUTHORISED) return new IdpcUnauthorisedError(response);
    if (httpStatus === SERVER_ERROR) return new IdpcServerError(response);
  }

  // Generate generic error (backstop)
  return new IdealPostcodesError({ httpStatus, message: JSON.stringify(body) });
};

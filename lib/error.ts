import { ApiErrorResponse } from "@ideal-postcodes/api-typings";

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
 * IdpcApiErrorOptions
 *
 * IdpcApiError requires both a HTTP status and a response body
 * To process an error with no JSON response body use IdealPostcodesError
 */
interface IdpcApiErrorOptions {
  httpStatus: number;
  body: ApiErrorResponse;
}

/**
 * IdpcApiError
 *
 * Base error class for API responses with a JSON body. Typically a subclass
 * will be used to capture the error category (e.g. 400, 401, 500, etc)
 */
export class IdpcApiError extends IdealPostcodesError {
  /**
   * Response code returned by JSON body. If no JSON body is present, this reads as null
   */
  public apiResponseCode: number;

  /**
   * Reponse message return by JSON body
   */
  public apiResponseMessage: string;

  /**
   * Raw API response
   */
  public body: ApiErrorResponse;

  /**
   * Returns an API error instance
   */
  constructor(options: IdpcApiErrorOptions) {
    super({
      ...options,
      message: options.body.message,
    });
    const { body } = options;
    this.body = body;
    this.apiResponseCode = body.code;
    this.apiResponseMessage = body.message;
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

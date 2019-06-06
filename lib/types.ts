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

/**
 * Authenticable
 *
 * If options require authentication
 */
export interface Authenticable {
  api_key: string;
  licensee?: string;
}

/**
 * AdminAuthenticable
 *
 * If options require a user token
 */
export interface AdminAuthenticable {
  user_token: string;
}

import { Config } from "../../lib/client";
import {
  TIMEOUT,
  STRICT_AUTHORISATION,
  API_URL,
  TLS,
  VERSION,
} from "../../lib/index";

export const defaultConfig: Config = Object.freeze({
  tls: TLS,
  api_key: "api_key",
  baseUrl: API_URL,
  version: VERSION,
  strictAuthorisation: STRICT_AUTHORISATION,
  timeout: TIMEOUT,
});

// Exports default config
export const newConfig = (): Config => {
  return { ...defaultConfig };
};

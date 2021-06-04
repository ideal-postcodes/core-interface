import { Agent, Header } from "./agent";

type Protocol = "http" | "https";

/**
 * Client Configuration Object
 */
export interface Config {
  /**
   * Use TLS
   *
   * @default true
   */
  tls?: boolean;
  /**
   * API Key. Used in API helper methods
   *
   * @default ""
   */
  api_key: string;
  /**
   * Target API domain
   *
   * @default "api.ideal-postcodes.co.uk"
   */
  baseUrl?: string;
  /**
   * API version
   *
   * @default "v1"
   */
  version?: string;
  /**
   * Force autocomplete authorisation via HTTP headers only
   *
   * @default false
   */
  strictAuthorisation?: boolean;
  /**
   * Default time in ms before HTTP request timeout. Defaults to 10s (`10000`)
   *
   * @default 10000
   */
  timeout?: number;
  /**
   * HTTP Agent
   *
   * For downstream clients like core-node and core-browser, this will default to the native platform HTTP client
   */
  agent?: Agent;
  /**
   * String map specifying default headers
   *
   * @default {}
   */
  header?: Header;
  /**
   * Append tags to helper requests like `lookupPostcode` and `lookupUDPRN`
   *
   * Tags attached to the client are overwritten on an request if it is also specified in the helper request options
   *
   * @default []
   */
  tags?: string[];
}

/**
 * Default configuration
 */
export const defaults: Required<Config> = {
  tls: true,
  api_key: "",
  baseUrl: "api.ideal-postcodes.co.uk",
  version: "v1",
  strictAuthorisation: false,
  timeout: 10000,
  header: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  tags: [],
  agent: {} as Agent,
};

/**
 * Client Class
 */
export class Client {
  public config: Required<Config>;

  constructor(config: Config) {
    this.config = { ...defaults, ...config };
    this.config.header = {
      ...defaults.header,
      ...(config.header && config.header),
    };
  }

  /**
   * Return base URL for API requests
   */
  url(): string {
    const { baseUrl, version } = this.config;
    return `${this.protocol()}://${baseUrl}/${version}`;
  }

  protocol(): Protocol {
    return this.config.tls ? "https" : "http";
  }
}

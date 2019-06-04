import { Agent, HttpResponse, Header } from "./agent";

type Protocol = "http" | "https";

export interface Config {
  /**
   * Use TLS. Defaults to `true`
   */
  tls: boolean;
  /**
   * API Key. Used in API helper methods
   */
  api_key: string;
  /**
   * Target API hostname. Defaults to `'api.ideal-postcodes.co.uk'`
   */
  baseUrl: string;
  /**
   * API version. Defaults to `'v1'`
   */
  version: string;
  /**
   * Force autocomplete authorisation via HTTP headers only. Defaults to `false`
   */
  strictAuthorisation: boolean;
  /**
   * Time before HTTP request timeout. Defaults to 10s
   */
  timeout: number;
  /**
   * HTTP Agent
   *
   * For downstream clients like core-node and core-browser, this will default to the native platform HTTP client
   */
  agent: Agent;
  /**
   * String map specifying default headers
   */
  header: Header;
}

interface Defaults {
  header: Header;
}

import {
  create as createPostcodeResource,
  PostcodeResource,
} from "./resources/postcodes";

export class Client {
  static defaults: Defaults = {
    header: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  readonly tls: boolean;
  readonly api_key: string;
  readonly baseUrl: string;
  readonly version: string;
  readonly strictAuthorisation: boolean;
  readonly timeout: number;
  readonly agent: Agent;
  readonly header: Header;
  readonly postcodes: PostcodeResource;

  constructor(config: Config) {
    this.tls = config.tls;
    this.api_key = config.api_key;
    this.baseUrl = config.baseUrl;
    this.version = config.version;
    this.strictAuthorisation = config.strictAuthorisation;
    this.timeout = config.timeout;
    this.agent = config.agent;
    this.header = { ...Client.defaults.header, ...config.header };
    this.postcodes = createPostcodeResource(this);
  }

  /**
   * url
   *
   * Return base URL for API requests
   */
  url(): string {
    return `${this.protocol()}://${this.baseUrl}/${this.version}`;
  }

  protocol(): Protocol {
    return this.tls ? "https" : "http";
  }

  /**
   * ping
   *
   * Dispatches HTTP request to root endpoint "`/`"
   */
  ping(): Promise<HttpResponse> {
    const method = "GET";
    const url = `${this.protocol()}://${this.baseUrl}/`;
    return this.agent.http({
      method,
      url,
      header: {},
      query: {},
      timeout: this.timeout,
    });
  }
}

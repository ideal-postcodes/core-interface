import { Agent, HttpResponse, Header } from "./agent";

type Protocol = "http" | "https";

export interface Config {
  tls: boolean;
  api_key: string;
  baseUrl: string;
  version: string;
  strictAuthorisation: boolean;
  timeout: number;
  agent: Agent;
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

  get url(): string {
    return `${this.protocol}://${this.baseUrl}/${this.version}`;
  }

  get protocol(): Protocol {
    return this.tls ? "https" : "http";
  }

  ping(): Promise<HttpResponse> {
    const method = "GET";
    const url = `${this.protocol}://${this.baseUrl}/`;
    return this.agent.http({
      method,
      url,
      header: {},
      query: {},
      timeout: this.timeout,
    });
  }
}

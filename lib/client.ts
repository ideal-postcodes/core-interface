import { Agent } from "./agent";
// import { BaseApiResponse } from "@ideal-postcodes/api-typings";

type Protocol = "http" | "https";

export interface Config {
  tls: boolean;
  api_key: string;
  baseUrl: string;
  version: string;
  strictAuthorisation: boolean;
  timeout: number;
  agent: Agent;
}

export class Client {
  readonly tls: boolean;
  readonly api_key: string;
  readonly baseUrl: string;
  readonly version: string;
  readonly strictAuthorisation: boolean;
  readonly timeout: number;
  readonly agent: Agent;

  constructor(config: Config) {
    this.tls = config.tls;
    this.api_key = config.api_key;
    this.baseUrl = config.baseUrl;
    this.version = config.version;
    this.strictAuthorisation = config.strictAuthorisation;
    this.timeout = config.timeout;
    this.agent = config.agent;
  }

  get url(): string {
    return `${this.protocol}://${this.baseUrl}/${this.version}`;
  }

  get protocol(): Protocol {
    return this.tls ? "https" : "http";
  }
}

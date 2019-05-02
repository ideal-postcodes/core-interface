import { Agent, HttpResponse } from "./agent";
import { ApiBaseResponse } from "@ideal-postcodes/api-typings";

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

interface Callback {
  (
    error: Error | void,
    body?: ApiBaseResponse,
    httpResponse?: HttpResponse
  ): void;
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

  ping(callback: Callback) {
    const method = "GET";
    const url = `${this.protocol}://${this.baseUrl}/`;
    this.agent.http(
      {
        method,
        url,
        header: {},
        query: {},
        timeout: this.timeout,
      },
      (error, response) => {
        if (error) return callback(error);
        return callback(undefined, response.body, response);
      }
    );
  }
}

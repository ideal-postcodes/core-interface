export interface Config {
  tls: boolean;
  api_key: string;
  baseUrl: string;
  version: string;
  strictAuthorisation: boolean;
  timeout: number;
}

export class Client {
  readonly tls: boolean;
  readonly api_key: string;
  readonly baseUrl: string;
  readonly version: string;
  readonly strictAuthorisation: boolean;
  readonly timeout: number;

  constructor(config: Config) {
    this.tls = config.tls;
    this.api_key = config.api_key;
    this.baseUrl = config.baseUrl;
    this.version = config.version;
    this.strictAuthorisation = config.strictAuthorisation;
    this.timeout = config.timeout;
  }

  get url() {
    return `http${this.tls ? "s" : ""}://${this.baseUrl}/${this.version}`;
  }
}

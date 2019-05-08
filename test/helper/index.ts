import { Omit } from "../../node_modules/type-zoo";
import {
  Agent,
  HttpRequest,
  HttpResponse,
  HttpCallback,
} from "../../lib/agent";
import { Config } from "../../lib/client";
import {
  TIMEOUT,
  STRICT_AUTHORISATION,
  API_URL,
  TLS,
  VERSION,
} from "../../lib/index";

// Exports default config
export const newConfig = (): Config => {
  return { ...defaultConfig };
};

type CallbackResponse = [undefined | Error, QueuedResponse];

interface QueuedResponse extends Omit<HttpResponse, "httpRequest"> {}

export class TestAgent implements Agent {
  private requests: HttpRequest[] = [];
  private pending: CallbackResponse[] = [];
  private timer = 10;

  public http(httpRequest: HttpRequest, callback: HttpCallback) {
    this.requests.push(httpRequest);
    setTimeout(() => {
      const [head, ...tail] = this.pending;
      this.pending = tail || [];
      if (head === undefined)
        throw new Error(
          "Responses must be `enqueued` before you make a request"
        );
      const httpResponse: HttpResponse = { ...head[1], ...{ httpRequest } };
      callback.apply(callback, [head[0], httpResponse]);
    }, this.timer);
  }

  public enqueue(response: CallbackResponse) {
    this.pending.push(response);
  }

  public setTimer(n: number) {
    this.timer = n;
  }
}

export const enqueue = (
  agent: Agent,
  error: Error | undefined,
  response: QueuedResponse
): Agent => {
  (<TestAgent>agent).enqueue([error, response]);
  return agent;
};

export const defaultHeader = {
  Accept: "application/json",
  "Content-Type": "application/x-www-form-urlencoded",
};

export const defaultConfig: Config = Object.freeze({
  tls: TLS,
  api_key: "api_key",
  baseUrl: API_URL,
  version: VERSION,
  strictAuthorisation: STRICT_AUTHORISATION,
  timeout: TIMEOUT,
  agent: new TestAgent(),
  header: defaultHeader,
});

const TEN_SECONDS = 10000;

export const defaultRequest: HttpRequest = Object.freeze({
  method: "GET",
  header: {},
  query: {},
  timeout: TEN_SECONDS,
  url: "https://api.ideal-postcodes.co.uk/v1/",
});

export const defaultResponse: HttpResponse = Object.freeze({
  httpStatus: 200,
  header: {},
  body: {},
  httpRequest: { ...defaultRequest },
});

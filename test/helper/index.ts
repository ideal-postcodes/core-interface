import { Fixture } from "@ideal-postcodes/api-fixtures";
import { toStringMap } from "../../lib/util";
import { HttpVerb, Agent, HttpRequest, HttpResponse } from "../../lib/agent";
import { Config, Client } from "../../lib/client";
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

export class TestAgent implements Agent {
  public http(_: HttpRequest) {
    const error = new Error("TestAgent must be mocked or stubbed with sinon");
    return Promise.reject(error);
  }
}

const defaultConfig: Config = Object.freeze({
  tls: TLS,
  api_key: "api_key",
  baseUrl: API_URL,
  version: VERSION,
  strictAuthorisation: STRICT_AUTHORISATION,
  timeout: TIMEOUT,
  agent: new TestAgent(),
  header: {},
  tags: [],
  filter: {},
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

export const toResponse = (
  fixture: Fixture,
  httpRequest?: HttpRequest
): HttpResponse => {
  const { httpStatus, headers, body } = fixture;
  return {
    httpStatus,
    header: toStringMap(headers),
    body,
    httpRequest: httpRequest ? httpRequest : toRequest(fixture),
  };
};

export const toRequest = (fixture: Fixture): HttpRequest => {
  const { header } = Client.defaults;
  const { url, query, method } = fixture;
  const timeout = TIMEOUT;
  return {
    timeout,
    method: method as HttpVerb,
    url,
    header,
    query: toStringMap(query),
  };
};

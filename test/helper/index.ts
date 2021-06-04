import { Fixture } from "@ideal-postcodes/api-fixtures";
import { toStringMap } from "../../lib/util";
import { HttpVerb, Agent, HttpRequest, HttpResponse } from "../../lib/agent";
import { Config } from "../../lib/client";
import { defaults } from "../../lib/index";

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
  ...defaults,
  api_key: "api_key",
  agent: new TestAgent(),
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
  const { header } = defaults;
  const { url, query, method } = fixture;
  const timeout = defaults.timeout;
  return {
    timeout,
    method: method as HttpVerb,
    url,
    header,
    query: toStringMap(query),
  };
};

import { assert } from "chai";
import {
  API_URL,
  TLS,
  VERSION,
  DEFAULT_TIMEOUT,
  STRICT_AUTHORISATION,
  Client,
} from "../lib/index";
import { Client as ApiClient } from "../lib/client";

const TEN_SECONDS = 10000;
describe("Main", () => {
  it("exports constants", () => {
    // Verify default exports
    assert.equal(API_URL, "api.ideal-postcodes.co.uk");
    assert.isTrue(TLS);
    assert.equal(VERSION, "v1");
    assert.equal(DEFAULT_TIMEOUT, TEN_SECONDS);
    assert.isFalse(STRICT_AUTHORISATION);
  });

  it("exports API client", () => {
    assert.equal(Client, ApiClient);
  });
});

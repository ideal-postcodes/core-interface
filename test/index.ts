import { assert } from "chai";
import {
  defaults,
  Client,
  addresses,
  errors,
  postcodes,
  udprn,
  umprn,
  keys,
  autocomplete,
} from "../lib/index";
import { Client as ApiClient } from "../lib/client";

const TEN_SECONDS = 10000;
describe("Main", () => {
  it("exports constants", () => {
    // Verify default exports
    assert.equal(defaults.baseUrl, "api.ideal-postcodes.co.uk");
    assert.isTrue(defaults.tls);
    assert.equal(defaults.version, "v1");
    assert.equal(defaults.timeout, TEN_SECONDS);
    assert.isFalse(defaults.strictAuthorisation);
  });

  it("exports API client", () => {
    assert.equal(Client, ApiClient);
  });

  it("exports errors module", () => {
    assert.isDefined(errors);
  });

  it("exports resources", () => {
    assert.isDefined(addresses);
    assert.isDefined(postcodes);
    assert.isDefined(udprn);
    assert.isDefined(umprn);
    assert.isDefined(keys);
    assert.isDefined(autocomplete);
  });
});

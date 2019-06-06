import { Client } from "../lib/client";
import { newConfig } from "./helper/index";
import {
  toStringMap,
  toTimeout,
  toHeader,
  toAuthHeader,
  appendAuthorization,
} from "../lib/util";
import { assert } from "chai";

const defaultHeader = Object.freeze({ ...Client.defaults.header });

describe("toStringMap", () => {
  it("shallow clones an object omitting non string values", () => {
    assert.deepEqual(
      toStringMap({
        foo: "bar",
        baz: undefined,
      }),
      {
        foo: "bar",
      }
    );
  });
  it("returns empty object if undefined", () => {
    assert.deepEqual(toStringMap(), {});
  });
});

describe("toHeader", () => {
  it("generates header object assigning greatest precedence to request header", () => {
    const client = new Client({ ...newConfig() });
    const header = { Accept: "foo", bar: undefined, baz: "quux" };

    assert.deepEqual(toHeader({ header }, client), {
      Accept: "foo",
      baz: "quux",
      "Content-Type": defaultHeader["Content-Type"],
    });
  });
  it("applies client default headers with lower precedence vis request", () => {
    const client = new Client({ ...newConfig() });
    const header = { bar: undefined, baz: "quux" };

    assert.deepEqual(toHeader({ header }, client), {
      Accept: defaultHeader.Accept,
      baz: "quux",
      "Content-Type": defaultHeader["Content-Type"],
    });
  });

  it("applies client default headers if request header undefined", () => {
    const client = new Client({ ...newConfig() });
    assert.deepEqual(toHeader({}, client), {
      Accept: defaultHeader.Accept,
      "Content-Type": defaultHeader["Content-Type"],
    });
  });
});

describe("toTimeout", () => {
  it("returns request timeout", () => {
    const client = new Client({ ...newConfig() });
    const timeout = 888;
    const request = { timeout };
    assert.equal(toTimeout(request, client), timeout);
  });

  it("returns client timeout if not specified in request", () => {
    const client = new Client({ ...newConfig() });
    const request = {};
    assert.equal(toTimeout(request, client), client.timeout);
  });
});

describe("toAuthHeader", () => {
  const client = new Client({ ...newConfig() });

  it("uses client api key by default", () => {
    assert.equal(
      toAuthHeader(client, {}),
      `IDEALPOSTCODES api_key="${client.api_key}"`
    );
  });

  it("allow provides precedence to api_key in options", () => {
    const api_key = "foobar";
    assert.equal(
      toAuthHeader(client, { api_key }),
      `IDEALPOSTCODES api_key="${api_key}"`
    );
  });

  it("allows user_token", () => {
    const user_token = "foobar";
    assert.equal(
      toAuthHeader(client, { user_token }),
      `IDEALPOSTCODES api_key="${client.api_key}" user_token="${user_token}"`
    );
  });

  it("allows licensee", () => {
    const licensee = "foobar";
    assert.equal(
      toAuthHeader(client, { licensee }),
      `IDEALPOSTCODES api_key="${client.api_key}" licensee="${licensee}"`
    );
  });

  it("allows a combination of all authorisation attributes", () => {
    const api_key = "api_foobar";
    const user_token = "user_foobar";
    const licensee = "licensee_foobar";
    assert.equal(
      toAuthHeader(client, { licensee, api_key, user_token }),
      `IDEALPOSTCODES api_key="${api_key}" licensee="${licensee}" user_token="${user_token}"`
    );
  });
});

describe("appendAuthorization", () => {
  const client = new Client({ ...newConfig() });

  it("mutates a headers object to include authorization", () => {
    const header = {};
    const options = {};
    const result = appendAuthorization({ header, client, options });
    assert.equal(header, result);
    assert.equal(
      result.Authorization,
      `IDEALPOSTCODES api_key="${client.api_key}"`
    );
  });
});

import { Client } from "../lib/client";
import { defaultConfig } from "./helper/index";
import { toStringMap, toTimeout, toHeader } from "../lib/util";
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
    const client = new Client({ ...defaultConfig });
    const header = { Accept: "foo", bar: undefined, baz: "quux" };

    assert.deepEqual(toHeader({ header }, client), {
      Accept: "foo",
      baz: "quux",
      "Content-Type": defaultHeader["Content-Type"],
    });
  });
  it("applies client default headers with lower precedence vis request", () => {
    const client = new Client({ ...defaultConfig });
    const header = { bar: undefined, baz: "quux" };

    assert.deepEqual(toHeader({ header }, client), {
      Accept: defaultHeader.Accept,
      baz: "quux",
      "Content-Type": defaultHeader["Content-Type"],
    });
  });

  it("applies client default headers if request header undefined", () => {
    const client = new Client({ ...defaultConfig });
    assert.deepEqual(toHeader({}, client), {
      Accept: defaultHeader.Accept,
      "Content-Type": defaultHeader["Content-Type"],
    });
  });
});

describe("toTimeout", () => {
  it("returns request timeout", () => {
    const client = new Client({ ...defaultConfig });
    const timeout = 888;
    const request = { timeout };
    assert.equal(toTimeout(request, client), timeout);
  });

  it("returns client timeout if not specified in request", () => {
    const client = new Client({ ...defaultConfig });
    const request = {};
    assert.equal(toTimeout(request, client), client.timeout);
  });
});

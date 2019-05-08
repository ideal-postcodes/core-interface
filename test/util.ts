import { Client } from "../lib/client";
import { defaultConfig } from "./helper/index";
import { toStringMap, toTimeout } from "../lib/util";
import { assert } from "chai";

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

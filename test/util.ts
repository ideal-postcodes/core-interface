import { toStringMap } from "../lib/util";
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

import { parse } from "../lib/error";
import { defaultResponse } from "./helper/index";
import { assert } from "chai";

describe("parse", () => {
  describe("when 200", () => {
    it("returns undefined for a 200 response", () => {
      const response = { ...defaultResponse };
      assert.isUndefined(parse(response));
    });
    it("returns undefined for 2xx response", () => {
      const response = { ...defaultResponse, ...{ statudeCode: 299 } };
      assert.isUndefined(parse(response));
    });
  });
});

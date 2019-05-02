import { parse, IdpcResourceNotFoundError } from "../lib/error";
import { defaultResponse } from "./helper/index";
import { assert } from "chai";

describe("parse", () => {
  it("returns IdpcResourceNotFoundError", () => {
    const body = {
      code: 404,
      message: "404 Page not found",
    };
    const httpStatus = 404;
    const response = {
      ...defaultResponse,
      ...{ httpStatus, body },
    };
    const error = parse(response);
    assert.instanceOf(error, IdpcResourceNotFoundError);
  });

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

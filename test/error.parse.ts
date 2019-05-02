import {
  parse,
  IdealPostcodesError,
  IdpcKeyNotFoundError,
  IdpcResourceNotFoundError,
  IdpcPostcodeNotFoundError,
} from "../lib/error";
import { defaultResponse } from "./helper/index";
import { errors, postcodes } from "@ideal-postcodes/api-fixtures";
import { assert } from "chai";

// IdpcBadRequestError,
// IdpcUnauthorisedError
// IdpcRequestFailedERror,
// IdpcUdprnNotFoundError,
// IdpcUmprnNotFoundError,

const { invalidKey } = errors;

describe("parse", () => {
  it("returns IdpcPostcodeNotFoundError", () => {
    const { body, httpStatus } = postcodes.notFound;
    const response = {
      ...defaultResponse,
      ...{ httpStatus, body },
    };
    const error = parse(response);
    assert.instanceOf(error, IdpcPostcodeNotFoundError);
  });
  it("returns IdpcKeyNotFoundError", () => {
    const { body, httpStatus } = invalidKey;
    const response = {
      ...defaultResponse,
      ...{ httpStatus, body },
    };
    const error = parse(response);
    assert.instanceOf(error, IdpcKeyNotFoundError);
  });

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

  it("returns a generic error if body is not json object", () => {
    const body = "foo";
    const httpStatus = 888;
    const response = {
      ...defaultResponse,
      ...{ httpStatus, body },
    };
    const error = parse(response);
    assert.instanceOf(error, IdealPostcodesError);

    assert.equal((error as IdealPostcodesError).httpStatus, httpStatus);
    assert.equal((error as IdealPostcodesError).message, body);
  });

  it("returns a generic error if malformed message", () => {
    const body = { code: 4040 };
    const httpStatus = 888;
    const response = {
      ...defaultResponse,
      ...{ httpStatus, body },
    };
    const error = parse(response);
    assert.instanceOf(error, IdealPostcodesError);

    assert.equal((error as IdealPostcodesError).httpStatus, httpStatus);
  });

  it("returns a generic error if malformed code", () => {
    const body = {
      message: "404 Page not found",
    };
    const httpStatus = 404;
    const response = {
      ...defaultResponse,
      ...{ httpStatus, body },
    };
    const error = parse(response);
    assert.instanceOf(error, IdealPostcodesError);
  });

  it("returns a generic error for unknown code", () => {
    const body = {
      message: "404 Page not found",
      code: 88888,
    };
    const httpStatus = 404;
    const response = {
      ...defaultResponse,
      ...{ httpStatus, body },
    };
    const error = parse(response);
    assert.instanceOf(error, IdealPostcodesError);
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

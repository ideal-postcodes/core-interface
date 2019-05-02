import {
  parse,
  IdealPostcodesError,
  IdpcKeyNotFoundError,
  IdpcApiError,
  IdpcResourceNotFoundError,
  IdpcUdprnNotFoundError,
  IdpcUmprnNotFoundError,
  IdpcPostcodeNotFoundError,
  IdpcBadRequestError,
  IdpcUnauthorisedError,
  IdpcRequestFailedError,
} from "../lib/error";
import { defaultResponse } from "./helper/index";
import { errors, postcodes, umprn, udprn } from "@ideal-postcodes/api-fixtures";
import { assert } from "chai";

const { invalidKey } = errors;

describe("parse", () => {
  it("returns IdpcUdprnNotFoundError", () => {
    const { body, httpStatus } = udprn.notFound;
    const response = {
      ...defaultResponse,
      ...{ httpStatus, body },
    };
    const error = parse(response);
    assert.instanceOf(error, IdpcUdprnNotFoundError);
  });

  it("returns IdpcUmprnNotFoundError", () => {
    const { body, httpStatus } = umprn.notFound;
    const response = {
      ...defaultResponse,
      ...{ httpStatus, body },
    };
    const error = parse(response);
    assert.instanceOf(error, IdpcUmprnNotFoundError);
  });

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

  it("returns IdpcRequestFailedError", () => {
    const body = {
      code: 402,
      message: "Request failed",
    };
    const httpStatus = 402;
    const response = {
      ...defaultResponse,
      ...{ httpStatus, body },
    };
    const error = parse(response);
    assert.instanceOf(error, IdpcRequestFailedError);
    assert.equal((error as IdpcApiError).apiResponseCode, body.code);
    assert.equal((error as IdpcApiError).apiResponseMessage, body.message);
  });

  it("returns IdpcBadRequestError", () => {
    const body = {
      code: 400,
      message: "Bad request",
    };
    const httpStatus = 400;
    const response = {
      ...defaultResponse,
      ...{ httpStatus, body },
    };
    const error = parse(response);
    assert.instanceOf(error, IdpcBadRequestError);
    assert.equal((error as IdpcApiError).httpStatus, httpStatus);
    assert.equal((error as IdpcApiError).apiResponseCode, body.code);
    assert.equal((error as IdpcApiError).apiResponseMessage, body.message);
  });

  it("returns IdpcUnauthorisedError", () => {
    const body = {
      code: 401,
      message: "Unauthorised access",
    };
    const httpStatus = 401;
    const response = {
      ...defaultResponse,
      ...{ httpStatus, body },
    };
    const error = parse(response);
    assert.instanceOf(error, IdpcUnauthorisedError);
    assert.equal((error as IdpcApiError).apiResponseCode, body.code);
    assert.equal((error as IdpcApiError).apiResponseMessage, body.message);
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
    assert.equal((error as IdpcApiError).httpStatus, httpStatus);
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
    assert.equal((error as IdealPostcodesError).message, JSON.stringify(body));
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

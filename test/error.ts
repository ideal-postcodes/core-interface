import { errors, postcodes, udprn, umprn } from "@ideal-postcodes/api-fixtures";
import { HttpResponse } from "../lib/agent";
import { toResponse, defaultRequest } from "./helper/index";
import { assert } from "chai";

const BAD_REQUEST = 400;
const UNAUTHORISED = 401;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

import {
  IdealPostcodesError,
  IdpcApiError,
  IdpcBadRequestError,
  IdpcUnauthorisedError,
  IdpcRequestFailedError,
  IdpcResourceNotFoundError,
  IdpcServerError,
  IdpcPostcodeNotFoundError,
  IdpcKeyNotFoundError,
  IdpcUdprnNotFoundError,
  IdpcUmprnNotFoundError,
} from "../lib/error";

describe("Error", () => {
  describe("IdealPostcodesError", () => {
    let error: IdealPostcodesError;

    describe("instantiation", () => {
      let message: string;
      let httpStatus: number;

      beforeEach(() => {
        message = "Error occurred";
        httpStatus = BAD_REQUEST;
        error = new IdealPostcodesError({ message, httpStatus });
      });

      it("assigns properties correctly", () => {
        assert.equal(error.message, message);
        assert.equal(error.httpStatus, httpStatus);
        assert.equal(error.name, "Ideal Postcodes Error");
      });

      it("interacts correctly with `instanceof`", () => {
        assert.isTrue(error instanceof Error);
        assert.isTrue(error instanceof IdealPostcodesError);
      });

      it("accepts optional metadata parameter", () => {
        const metadata = { foo: "bar", baz: {} };
        const errorWithMeta = new IdealPostcodesError({
          message,
          httpStatus,
          metadata,
        });
        assert.equal(errorWithMeta.metadata, metadata);
      });

      it("instantiates with empty metadata object", () => {
        assert.deepEqual(error.metadata, {});
      });
    });
  });

  interface SuiteTestOptions {
    ErrorKlass: { new (httpResponse: HttpResponse): IdpcApiError };
    httpResponse: HttpResponse;
  }

  const idpcApiErrorSuite = (options: SuiteTestOptions) => {
    const { httpResponse, ErrorKlass } = options;
    const error = new ErrorKlass(httpResponse);

    it("assigns properties correctly", () => {
      assert.deepEqual(error.response, httpResponse);
      assert.equal(error.message, httpResponse.body.message);
      assert.equal(error.httpStatus, httpResponse.httpStatus);
      assert.equal(error.name, "Ideal Postcodes Error");
    });

    it("interacts correctly with `instanceof`", () => {
      assert.isTrue(error instanceof Error);
      assert.isTrue(error instanceof IdealPostcodesError);
      assert.isTrue(error instanceof IdpcApiError);
      assert.isTrue(error instanceof ErrorKlass);
    });
  };

  describe("IdpcApiError", () => {
    describe("instantiation", () => {
      idpcApiErrorSuite({
        httpResponse: toResponse(errors.invalidKey),
        ErrorKlass: IdpcApiError,
      });
    });
  });

  describe("IdpcBadRequestError", () => {
    describe("instantiation", () => {
      const httpResponse = {
        httpStatus: BAD_REQUEST,
        header: {},
        httpRequest: defaultRequest,
        body: {
          code: 4000,
          message: "Invalid syntax submitted.",
        },
      };
      idpcApiErrorSuite({ httpResponse, ErrorKlass: IdpcBadRequestError });
    });
  });

  describe("IdpcUnauthorisedError", () => {
    describe("instantiation", () => {
      const httpResponse = {
        httpStatus: UNAUTHORISED,
        header: {},
        httpRequest: defaultRequest,
        body: {
          code: 4012,
          message: "Forbidden",
        },
      };
      idpcApiErrorSuite({
        httpResponse,
        ErrorKlass: IdpcUnauthorisedError,
      });
    });
  });

  describe("IdpcResourceNotFoundError", () => {
    describe("instantiation", () => {
      idpcApiErrorSuite({
        httpResponse: toResponse(errors.invalidUrl),
        ErrorKlass: IdpcResourceNotFoundError,
      });
    });
  });

  describe("IdpcPostcodeNotFoundError", () => {
    describe("instantiation", () => {
      idpcApiErrorSuite({
        httpResponse: toResponse(postcodes.notFound),
        ErrorKlass: IdpcPostcodeNotFoundError,
      });
    });
  });

  describe("IdpcKeyNotFoundError", () => {
    describe("instantiation", () => {
      const httpResponse = {
        httpStatus: NOT_FOUND,
        header: {},
        httpRequest: defaultRequest,
        body: {
          code: 4042,
          message: "Key not found",
        },
      };
      idpcApiErrorSuite({
        httpResponse,
        ErrorKlass: IdpcKeyNotFoundError,
      });
    });
  });

  describe("IdpcUdprnNotFoundError", () => {
    describe("instantiation", () => {
      idpcApiErrorSuite({
        httpResponse: toResponse(udprn.notFound),
        ErrorKlass: IdpcUdprnNotFoundError,
      });
    });
  });

  describe("IdpcUmprnNotFoundError", () => {
    describe("instantiation", () => {
      idpcApiErrorSuite({
        httpResponse: toResponse(umprn.notFound),
        ErrorKlass: IdpcUmprnNotFoundError,
      });
    });
  });

  describe("IdpcRequestFailedError", () => {
    describe("instantiation", () => {
      idpcApiErrorSuite({
        httpResponse: toResponse(errors.balanceDepleted),
        ErrorKlass: IdpcRequestFailedError,
      });
    });
  });

  describe("IdpcServerError", () => {
    describe("instantiation", () => {
      const httpResponse = {
        httpStatus: SERVER_ERROR,
        header: {},
        httpRequest: defaultRequest,
        body: {
          code: 5000,
          message: "Server error",
        },
      };
      idpcApiErrorSuite({
        httpResponse,
        ErrorKlass: IdpcServerError,
      });
    });
  });
});

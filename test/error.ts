import { ApiErrorResponse } from "@ideal-postcodes/api-typings";
import { assert } from "chai";

const BAD_REQUEST = 400;
const UNAUTHORISED = 401;
const PAYMENT_REQUESTED = 402;
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
    });
  });

  interface ApiErrorOptions {
    httpStatus: number;
    body: ApiErrorResponse;
  }

  interface SuiteTestOptions {
    ErrorKlass: { new (options: ApiErrorOptions): IdpcApiError };
    httpStatus: number;
    body: ApiErrorResponse;
  }

  const idpcApiErrorSuite = (options: SuiteTestOptions) => {
    const { body, httpStatus, ErrorKlass } = options;
    const error = new ErrorKlass({ body, httpStatus });

    it("assigns properties correctly", () => {
      assert.deepEqual(error.body, body);
      assert.equal(error.message, body.message);
      assert.equal(error.apiResponseCode, body.code);
      assert.equal(error.httpStatus, httpStatus);
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
      const httpStatus = UNAUTHORISED;
      const body = {
        code: 4010,
        message: "Invalid Key.",
      };
      idpcApiErrorSuite({ body, httpStatus, ErrorKlass: IdpcApiError });
    });
  });

  describe("IdpcBadRequestError", () => {
    describe("instantiation", () => {
      const httpStatus = BAD_REQUEST;
      const body = {
        code: 4000,
        message: "Invalid syntax submitted.",
      };
      idpcApiErrorSuite({ body, httpStatus, ErrorKlass: IdpcBadRequestError });
    });
  });

  describe("IdpcUnauthorisedError", () => {
    describe("instantiation", () => {
      const httpStatus = UNAUTHORISED;
      const body = {
        code: 4012,
        message: "Forbidden",
      };
      idpcApiErrorSuite({
        body,
        httpStatus,
        ErrorKlass: IdpcUnauthorisedError,
      });
    });
  });

  describe("IdpcResourceNotFoundError", () => {
    describe("instantiation", () => {
      const httpStatus = NOT_FOUND;
      const body = {
        code: 4040,
        message: "Postcode not found",
      };
      idpcApiErrorSuite({
        body,
        httpStatus,
        ErrorKlass: IdpcResourceNotFoundError,
      });
    });
  });

  describe("IdpcPostcodeNotFoundError", () => {
    describe("instantiation", () => {
      const httpStatus = NOT_FOUND;
      const body = {
        code: 4040,
        message: "Postcode not found",
      };
      idpcApiErrorSuite({
        body,
        httpStatus,
        ErrorKlass: IdpcPostcodeNotFoundError,
      });
    });
  });

  describe("IdpcKeyNotFoundError", () => {
    describe("instantiation", () => {
      const httpStatus = NOT_FOUND;
      const body = {
        code: 4042,
        message: "Key Balance depleted",
      };
      idpcApiErrorSuite({ body, httpStatus, ErrorKlass: IdpcKeyNotFoundError });
    });
  });

  describe("IdpcUdprnNotFoundError", () => {
    describe("instantiation", () => {
      const httpStatus = NOT_FOUND;
      const body = {
        code: 4044,
        message: "No UDPRN found",
      };
      idpcApiErrorSuite({
        body,
        httpStatus,
        ErrorKlass: IdpcUdprnNotFoundError,
      });
    });
  });

  describe("IdpcUmprnNotFoundError", () => {
    describe("instantiation", () => {
      const httpStatus = NOT_FOUND;
      const body = {
        code: 4046,
        message: "No UMPRN found",
      };
      idpcApiErrorSuite({
        body,
        httpStatus,
        ErrorKlass: IdpcUmprnNotFoundError,
      });
    });
  });

  describe("IdpcRequestFailedError", () => {
    describe("instantiation", () => {
      const httpStatus = PAYMENT_REQUESTED;
      const body = {
        code: 4020,
        message: "Key Balance depleted",
      };
      idpcApiErrorSuite({
        body,
        httpStatus,
        ErrorKlass: IdpcRequestFailedError,
      });
    });
  });
  describe("IdpcServerError", () => {
    describe("instantiation", () => {
      const httpStatus = SERVER_ERROR;
      const body = {
        code: 5000,
        message: "Something went wrong",
      };
      idpcApiErrorSuite({ body, httpStatus, ErrorKlass: IdpcServerError });
    });
  });
});

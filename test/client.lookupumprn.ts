import { assert } from "chai";
import * as sinon from "sinon";
import { Client } from "../lib/client";
import { newConfig } from "./helper/index";
import { AddressKeys } from "../lib/types";
import { HttpRequest } from "../lib/agent";
import { umprn as fixtures, errors } from "@ideal-postcodes/api-fixtures";
import { toResponse } from "./helper/index";
import { IdpcInvalidKeyError } from "../lib/error";

describe("Client", () => {
  afterEach(() => sinon.restore());

  describe("lookupUmprn", () => {
    const client = new Client(newConfig());

    it("returns an address", (done) => {
      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout: client.timeout,
        query: {},
        header: {
          ...Client.defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${client.api_key}"`,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/umprn/1",
      };

      const stub = sinon
        .stub(client.agent, "http")
        .resolves(toResponse(fixtures.success, expectedRequest));

      const umprn = 1;

      client
        .lookupUmprn({ umprn })
        .then((addresses) => {
          assert.deepEqual(fixtures.success.body.result, addresses);
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          done();
        })
        .catch((error) => done(error));
    });

    it("accepts arguments laid out in HTTP API", (done) => {
      const sourceIp = "8.8.8.8";
      const filter: AddressKeys[] = ["line_1", "postcode"];
      const tags = ["foo", "bar"];
      const timeout = 3000;
      const licensee = "quux";
      const api_key = "fooo";
      const umprn = 1;

      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout,
        query: {
          filter: "line_1,postcode",
          tags: "foo,bar",
        },
        header: {
          ...Client.defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${api_key}" licensee="${licensee}"`,
          "IDPC-Source-IP": sourceIp,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/umprn/1",
      };

      const stub = sinon
        .stub(client.agent, "http")
        .resolves(toResponse(fixtures.success, expectedRequest));

      client
        .lookupUmprn({
          umprn,
          licensee,
          api_key,
          sourceIp,
          filter,
          tags,
          timeout,
        })
        .then((address) => {
          assert.deepEqual(fixtures.success.body.result, address);
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          done();
        })
        .catch((error) => done(error));
    });

    it("returns null if umprn not found", (done) => {
      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout: client.timeout,
        query: {},
        header: {
          ...Client.defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${client.api_key}"`,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/umprn/-1",
      };

      sinon
        .stub(client.agent, "http")
        .resolves(toResponse(fixtures.notFound, expectedRequest));

      const umprn = -1;

      client
        .lookupUmprn({ umprn })
        .then((address) => {
          assert.isNull(address);
          done();
        })
        .catch((error) => done(error));
    });

    it("`catches` for all other errors", (done) => {
      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout: client.timeout,
        query: {},
        header: {
          ...Client.defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${client.api_key}"`,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/umprn/1",
      };

      sinon
        .stub(client.agent, "http")
        .resolves(toResponse(errors.invalidKey, expectedRequest));

      const umprn = 1;

      client
        .lookupUmprn({ umprn })
        .then(() => done(new Error("This test should throw")))
        .catch((error) => {
          assert.instanceOf(error, IdpcInvalidKeyError);
          done();
        });
    });
  });
});

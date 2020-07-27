import { assert } from "chai";
import * as sinon from "sinon";
import { Client } from "../lib/client";
import { newConfig } from "./helper/index";
import { AddressKeys } from "../lib/types";
import { HttpRequest } from "../lib/agent";
import { addresses, errors } from "@ideal-postcodes/api-fixtures";
import { toResponse } from "./helper/index";
import { IdpcInvalidKeyError } from "../lib/error";

describe("Client", () => {
  afterEach(() => sinon.restore());

  describe("lookupAddress", () => {
    const client = new Client(newConfig());

    it("returns a list of addresses", (done) => {
      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout: client.timeout,
        query: { query: "10" },
        header: {
          ...Client.defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${client.api_key}"`,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/addresses",
      };

      const stub = sinon
        .stub(client.agent, "http")
        .resolves(toResponse(addresses.success, expectedRequest));

      client
        .lookupAddress({ query: "10" })
        .then((hits) => {
          assert.deepEqual(addresses.success.body.result.hits, hits);
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
      const page = 1;
      const limit = 10;

      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout,
        query: {
          filter: "line_1,postcode",
          tags: "foo,bar",
          page: "1",
          limit: "10",
          query: "10",
        },
        header: {
          ...Client.defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${api_key}" licensee="${licensee}"`,
          "IDPC-Source-IP": sourceIp,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/addresses",
      };

      const stub = sinon
        .stub(client.agent, "http")
        .resolves(toResponse(addresses.success, expectedRequest));

      client
        .lookupAddress({
          query: "10",
          licensee,
          api_key,
          sourceIp,
          filter,
          tags,
          limit,
          timeout,
          page,
        })
        .then((hits) => {
          assert.deepEqual(addresses.success.body.result.hits, hits);
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          done();
        })
        .catch((error) => done(error));
    });

    it("returns empty array if no match", (done) => {
      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout: client.timeout,
        query: {},
        header: {
          ...Client.defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${client.api_key}"`,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/addresses",
      };

      sinon
        .stub(client.agent, "http")
        .resolves(toResponse(addresses.empty, expectedRequest));

      client
        .lookupAddress({ query: "foo" })
        .then((results) => {
          assert.deepEqual(results, []);
          done();
        })
        .catch((error) => done(error));
    });

    it("`catches` for all other errors", (done) => {
      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout: client.timeout,
        query: { query: "foo" },
        header: {
          ...Client.defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${client.api_key}"`,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/addresses",
      };

      sinon
        .stub(client.agent, "http")
        .resolves(toResponse(errors.invalidKey, expectedRequest));

      client
        .lookupAddress({ query: "foo" })
        .then(() => done(new Error("This test should throw")))
        .catch((error) => {
          assert.instanceOf(error, IdpcInvalidKeyError);
          done();
        });
    });
  });
});

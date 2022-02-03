import { assert } from "chai";
import * as sinon from "sinon";
import {
  HttpRequest,
  lookupAddress,
  AddressKeys,
  Client,
  defaults,
} from "../lib/index";
import { addresses, errors } from "@ideal-postcodes/api-fixtures";
import { toResponse, newConfig } from "./helper/index";
import { IdpcInvalidKeyError } from "../lib/error";

describe("Client", () => {
  afterEach(() => sinon.restore());

  describe("lookupAddress", () => {
    const client = new Client(newConfig());

    it("returns a list of addresses", (done) => {
      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout: client.config.timeout,
        query: { query: "10" },
        header: {
          ...defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${client.config.api_key}"`,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/addresses",
      };

      const stub = sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(addresses.success, expectedRequest));

      lookupAddress({ client, query: "10" })
        .then((hits) => {
          //@ts-ignore
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
          ...defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${api_key}" licensee="${licensee}"`,
          "IDPC-Source-IP": sourceIp,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/addresses",
      };

      const stub = sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(addresses.success, expectedRequest));

      lookupAddress({
        client,
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
          //@ts-ignore
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
        timeout: client.config.timeout,
        query: {},
        header: {
          ...defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${client.config.api_key}"`,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/addresses",
      };

      sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(addresses.empty, expectedRequest));

      lookupAddress({ client, query: "foo" })
        .then((results) => {
          assert.deepEqual(results, []);
          done();
        })
        .catch((error) => done(error));
    });

    it("`catches` for all other errors", (done) => {
      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout: client.config.timeout,
        query: { query: "foo" },
        header: {
          ...defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${client.config.api_key}"`,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/addresses",
      };

      sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(errors.invalidKey, expectedRequest));

      lookupAddress({ client, query: "foo" })
        .then(() => done(new Error("This test should throw")))
        .catch((error) => {
          assert.instanceOf(error, IdpcInvalidKeyError);
          done();
        });
    });
  });
});

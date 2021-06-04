import { assert } from "chai";
import * as sinon from "sinon";
import { toResponse, newConfig } from "./helper/index";
import { AddressKeys } from "../lib/types";
import { defaults, Client, HttpRequest, lookupPostcode } from "../lib/index";
import { postcodes, errors } from "@ideal-postcodes/api-fixtures";
import { IdpcInvalidKeyError } from "../lib/error";

describe("Client", () => {
  afterEach(() => sinon.restore());

  describe("lookupPostcode", () => {
    const client = new Client(newConfig());

    it("returns a list of addresses", (done) => {
      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout: client.config.timeout,
        query: {},
        header: {
          ...defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${client.config.api_key}"`,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/postcodes/id1%201qd",
      };

      const stub = sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(postcodes.success, expectedRequest));
      const postcode = "id1 1qd";
      lookupPostcode({ client, postcode })
        .then((addresses) => {
          assert.deepEqual(postcodes.success.body.result, addresses);
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
      const postcode = "id1 1qd";
      const licensee = "quux";
      const api_key = "fooo";
      const page = 1;

      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout,
        query: {
          filter: "line_1,postcode",
          tags: "foo,bar",
          page: "1",
        },
        header: {
          ...defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${api_key}" licensee="${licensee}"`,
          "IDPC-Source-IP": sourceIp,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/postcodes/id1%201qd",
      };

      const stub = sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(postcodes.success, expectedRequest));

      lookupPostcode({
        client,
        postcode,
        licensee,
        api_key,
        sourceIp,
        filter,
        tags,
        timeout,
        page,
      })
        .then((addresses) => {
          assert.deepEqual(postcodes.success.body.result, addresses);
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          done();
        })
        .catch((error) => done(error));
    });
    it("returns empty array if postcode not found", (done) => {
      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout: client.config.timeout,
        query: {},
        header: {
          ...defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${client.config.api_key}"`,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/postcodes/id1kfa",
      };

      sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(postcodes.notFound, expectedRequest));

      const postcode = "id1kfa";

      lookupPostcode({ client, postcode })
        .then((addresses) => {
          assert.deepEqual(addresses, []);
          done();
        })
        .catch((error) => done(error));
    });

    it("`catches` for all other errors", (done) => {
      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout: client.config.timeout,
        query: {},
        header: {
          ...defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${client.config.api_key}"`,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/postcodes/id1%201qd",
      };

      sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(errors.invalidKey, expectedRequest));

      const postcode = "id11qd";

      lookupPostcode({ client, postcode })
        .then(() => done(new Error("This test should throw")))
        .catch((error) => {
          assert.instanceOf(error, IdpcInvalidKeyError);
          done();
        });
    });
  });
});

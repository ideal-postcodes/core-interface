import { assert } from "chai";
import * as sinon from "sinon";
import { Client } from "../lib/client";
import { newConfig, defaultResponse } from "./helper/index";
import { AddressKeys } from "../lib/types";
import { HttpVerb, HttpRequest } from "../lib/agent";
import { postcodes, errors } from "@ideal-postcodes/api-fixtures";
import { toResponse } from "./helper/index";
import { IdpcInvalidKeyError } from "../lib/error";

describe("Client", () => {
  afterEach(() => sinon.restore());

  it("assigns instance variables", () => {
    const config = newConfig();
    const client = new Client(config);
    assert.equal(client.api_key, config.api_key);
    assert.equal(client.tls, config.tls);
    assert.equal(client.baseUrl, config.baseUrl);
    assert.equal(client.version, config.version);
    assert.equal(client.strictAuthorisation, config.strictAuthorisation);
    assert.equal(client.timeout, config.timeout);
    assert.equal(client.agent, config.agent);
    assert.deepEqual(client.header, Client.defaults.header);
  });

  it("allows headers to be overriden and appended", () => {
    const config = newConfig();
    config.header = {
      Accept: "foo",
      bar: "baz",
    };

    const { header } = new Client(config);

    assert.deepEqual(header, {
      Accept: "foo",
      bar: "baz",
      "Content-Type": Client.defaults.header["Content-Type"],
    });
  });

  describe("#url", () => {
    it("returns base url", () => {
      const client = new Client(newConfig());
      assert.equal(client.url(), "https://api.ideal-postcodes.co.uk/v1");
    });

    it("allows non-TLS connections", () => {
      const config = { tls: false };
      const client = new Client({ ...newConfig(), ...config });
      assert.equal(client.url(), "http://api.ideal-postcodes.co.uk/v1");
    });

    it("supports versioning", () => {
      const config = { version: "v2" };
      const client = new Client({ ...newConfig(), ...config });
      assert.equal(client.url(), "https://api.ideal-postcodes.co.uk/v2");
    });

    it("supports port number definitions", () => {
      const config = { baseUrl: "api.ideal-postcodes.co.uk:8000" };
      const client = new Client({ ...newConfig(), ...config });
      assert.equal(client.url(), "https://api.ideal-postcodes.co.uk:8000/v1");
    });
  });

  describe("#protocol", () => {
    it("returns https if tls is true", () => {
      const config = { tls: true };
      const client = new Client({ ...newConfig(), ...config });
      assert.equal(client.protocol(), "https");
    });

    it("returns https if tls is true", () => {
      const config = { tls: false };
      const client = new Client({ ...newConfig(), ...config });
      assert.equal(client.protocol(), "http");
    });
  });

  describe("Client.defaults", () => {
    it("exports default header", () => {
      assert.deepEqual(Client.defaults.header, {
        "Content-Type": "application/json",
        Accept: "application/json",
      });
    });
  });

  describe("Resoures", () => {
    it("exposes API resources", () => {
      const client = new Client({ ...newConfig() });
      assert.isDefined(client.postcodes);
      assert.isDefined(client.addresses);
      assert.isDefined(client.udprn);
      assert.isDefined(client.umprn);
      assert.isDefined(client.keys);
    });
  });

  describe("ping", () => {
    it("requests '/'", done => {
      const client = new Client(newConfig());
      const expectedRequest = {
        method: "GET" as HttpVerb,
        header: {},
        query: {},
        timeout: client.timeout,
        url: `${client.protocol()}://${client.baseUrl}/`,
      };
      const stub = sinon.stub(client.agent, "http").resolves(defaultResponse);
      client.ping().then(() => {
        sinon.assert.calledOnce(stub);
        sinon.assert.calledWithExactly(stub, expectedRequest);
        done();
      });
    });
  });

  describe("lookupPostcode", () => {
    const client = new Client(newConfig());

    it("returns a list of addresses", done => {
      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout: client.timeout,
        query: {},
        header: {
          ...Client.defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${client.api_key}"`,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/postcodes/id1%201qd",
      };

      const stub = sinon
        .stub(client.agent, "http")
        .resolves(toResponse(postcodes.success, expectedRequest));
      const postcode = "id1 1qd";
      client
        .lookupPostcode({ postcode })
        .then(addresses => {
          assert.deepEqual(postcodes.success.body.result, addresses);
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          done();
        })
        .catch(error => done(error));
    });

    it("accepts arguments laid out in HTTP API", done => {
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
          ...Client.defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${api_key}" licensee="${licensee}"`,
          "IDPC-Source-IP": sourceIp,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/postcodes/id1%201qd",
      };

      const stub = sinon
        .stub(client.agent, "http")
        .resolves(toResponse(postcodes.success, expectedRequest));

      client
        .lookupPostcode({
          postcode,
          licensee,
          api_key,
          sourceIp,
          filter,
          tags,
          timeout,
          page,
        })
        .then(addresses => {
          assert.deepEqual(postcodes.success.body.result, addresses);
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          done();
        })
        .catch(error => done(error));
    });
    it("returns empty array if postcode not found", done => {
      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout: client.timeout,
        query: {},
        header: {
          ...Client.defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${client.api_key}"`,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/postcodes/id1kfa",
      };

      sinon
        .stub(client.agent, "http")
        .resolves(toResponse(postcodes.notFound, expectedRequest));

      const postcode = "id1kfa";

      client
        .lookupPostcode({ postcode })
        .then(addresses => {
          assert.deepEqual(addresses, []);
          done();
        })
        .catch(error => done(error));
    });

    it("`catches` for all other errors", done => {
      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout: client.timeout,
        query: {},
        header: {
          ...Client.defaults.header,
          Authorization: `IDEALPOSTCODES api_key="${client.api_key}"`,
        },
        url: "https://api.ideal-postcodes.co.uk/v1/postcodes/id1%201qd",
      };

      sinon
        .stub(client.agent, "http")
        .resolves(toResponse(errors.invalidKey, expectedRequest));

      const postcode = "id11qd";

      client
        .lookupPostcode({ postcode })
        .then(() => done(new Error("This test should throw")))
        .catch(error => {
          assert.instanceOf(error, IdpcInvalidKeyError);
          done();
        });
    });
  });
});

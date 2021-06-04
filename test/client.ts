import { assert } from "chai";
import * as sinon from "sinon";
import { defaults, ping } from "../lib/index";
import { Client } from "../lib/client";
import { newConfig, defaultResponse } from "./helper/index";
import { HttpVerb } from "../lib/agent";

describe("Client", () => {
  afterEach(() => sinon.restore());

  it("assigns instance variables", () => {
    const config = newConfig();
    const client = new Client(config);
    assert.equal(client.config.api_key, config.api_key);
    assert.equal(client.config.tls, config.tls);
    assert.equal(client.config.baseUrl, config.baseUrl);
    assert.equal(client.config.version, config.version);
    assert.equal(client.config.strictAuthorisation, config.strictAuthorisation);
    assert.equal(client.config.timeout, config.timeout);
    assert.equal(client.config.agent, config.agent);
    assert.deepEqual(client.config.header, defaults.header);
  });

  it("allows headers to be overriden and appended", () => {
    const config = newConfig();
    config.header = {
      Accept: "foo",
      bar: "baz",
    };

    const { header } = new Client(config).config;

    assert.deepEqual(header, {
      Accept: "foo",
      bar: "baz",
      "Content-Type": defaults.header["Content-Type"],
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
      assert.deepEqual(defaults.header, {
        "Content-Type": "application/json",
        Accept: "application/json",
      });
    });
  });

  describe("ping", () => {
    it("requests '/'", (done) => {
      const client = new Client(newConfig());
      const expectedRequest = {
        method: "GET" as HttpVerb,
        header: {},
        query: {},
        timeout: client.config.timeout,
        url: `${client.protocol()}://${client.config.baseUrl}/`,
      };
      const stub = sinon
        .stub(client.config.agent, "http")
        .resolves(defaultResponse);
      ping(client).then(() => {
        sinon.assert.calledOnce(stub);
        sinon.assert.calledWithExactly(stub, expectedRequest);
        done();
      });
    });
  });
});

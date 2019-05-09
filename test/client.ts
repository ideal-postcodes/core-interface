import { assert } from "chai";
import * as sinon from "sinon";
import { Client } from "../lib/client";
import { newConfig } from "./helper/index";

describe("Client", () => {
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

  describe("url", () => {
    it("returns base url", () => {
      const client = new Client(newConfig());
      assert.equal(client.url, "https://api.ideal-postcodes.co.uk/v1");
    });

    it("allows non-TLS connections", () => {
      const config = { tls: false };
      const client = new Client({ ...newConfig(), ...config });
      assert.equal(client.url, "http://api.ideal-postcodes.co.uk/v1");
    });

    it("supports versioning", () => {
      const config = { version: "v2" };
      const client = new Client({ ...newConfig(), ...config });
      assert.equal(client.url, "https://api.ideal-postcodes.co.uk/v2");
    });

    it("supports port number definitions", () => {
      const config = { baseUrl: "api.ideal-postcodes.co.uk:8000" };
      const client = new Client({ ...newConfig(), ...config });
      assert.equal(client.url, "https://api.ideal-postcodes.co.uk:8000/v1");
    });
  });

  describe("protocol", () => {
    it("returns https if tls is true", () => {
      const config = { tls: true };
      const client = new Client({ ...newConfig(), ...config });
      assert.equal(client.protocol, "https");
    });

    it("returns https if tls is true", () => {
      const config = { tls: false };
      const client = new Client({ ...newConfig(), ...config });
      assert.equal(client.protocol, "http");
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

  describe("ping", () => {
    it("requests '/'", async () => {
      const client = new Client(newConfig());
      const mock = sinon.mock(client.agent);
      mock
        .expects("http")
        .once()
        .withExactArgs({
          method: "GET",
          header: {},
          query: {},
          timeout: client.timeout,
          url: `${client.protocol}://${client.baseUrl}/`,
        });
      await client.ping();
      mock.verify();
    });
  });
});

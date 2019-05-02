import { assert } from "chai";
import { Client } from "../lib/client";
import { defaultConfig } from "./helper/index";

describe("Client", () => {
  it("assigns instance variables", () => {
    const client = new Client(defaultConfig);
    assert.equal(client.api_key, defaultConfig.api_key);
    assert.equal(client.tls, defaultConfig.tls);
    assert.equal(client.baseUrl, defaultConfig.baseUrl);
    assert.equal(client.version, defaultConfig.version);
    assert.equal(client.strictAuthorisation, defaultConfig.strictAuthorisation);
    assert.equal(client.timeout, defaultConfig.timeout);
    assert.equal(client.agent, defaultConfig.agent);
  });

  describe("url", () => {
    it("returns base url", () => {
      const client = new Client(defaultConfig);
      assert.equal(client.url, "https://api.ideal-postcodes.co.uk/v1");
    });

    it("allows non-TLS connections", () => {
      const config = { tls: false };
      const client = new Client({ ...defaultConfig, ...config });
      assert.equal(client.url, "http://api.ideal-postcodes.co.uk/v1");
    });

    it("supports versioning", () => {
      const config = { version: "v2" };
      const client = new Client({ ...defaultConfig, ...config });
      assert.equal(client.url, "https://api.ideal-postcodes.co.uk/v2");
    });
    it("supports port number definitions", () => {
      const config = { baseUrl: "api.ideal-postcodes.co.uk:8000" };
      const client = new Client({ ...defaultConfig, ...config });
      assert.equal(client.url, "https://api.ideal-postcodes.co.uk:8000/v1");
    });
  });

  describe("protocol", () => {
    it("returns https if tls is true", () => {
      const config = { tls: true };
      const client = new Client({ ...defaultConfig, ...config });
      assert.equal(client.protocol, "https");
    });

    it("returns https if tls is true", () => {
      const config = { tls: false };
      const client = new Client({ ...defaultConfig, ...config });
      assert.equal(client.protocol, "http");
    });
  });
});

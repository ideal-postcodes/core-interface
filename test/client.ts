import { assert } from "chai";
import { spy, SinonSpy } from "sinon";
import { Client } from "../lib/client";
import { defaultConfig, newConfig, enqueue } from "./helper/index";

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
    assert.deepEqual(client.header, Client.defaults.header);
  });

  it("allows headers to be overriden and appended", () => {
    const config = { ...defaultConfig };
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

  describe("Client.defaults", () => {
    it("exports default header", () => {
      assert.deepEqual(Client.defaults.header, {
        "Content-Type": "application/json",
        Accept: "application/json",
      });
    });
  });

  describe("ping", () => {
    let http: SinonSpy;
    let client: Client;
    let response;

    beforeEach(() => {
      client = new Client(newConfig());
      const { agent } = client;
      response = {
        httpStatus: 200,
        header: {},
        body: {
          message: "Success",
          code: 2000,
        },
      };
      enqueue(agent, undefined, response);
      http = spy(agent, "http");
    });

    afterEach(() => {
      http.restore();
    });

    it("requests '/'", async () => {
      const expectedRequest = {
        method: "GET",
        header: {},
        query: {},
        timeout: client.timeout,
        url: `${client.protocol}://${client.baseUrl}/`,
      };
      client.ping(() => {});
      assert.isTrue(http.calledOnce);
      assert.deepEqual(http.args[0][0], expectedRequest);
    });
  });
});

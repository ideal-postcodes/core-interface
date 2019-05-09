import { spy } from "sinon";
import { HttpVerb } from "../lib/agent";
import { create, PostcodeResource } from "../lib/resources/postcodes";
import { postcodes } from "@ideal-postcodes/api-fixtures";
import { Client } from "../lib/client";
import { defaultConfig, enqueue, toEnqueuedResponse } from "./helper/index";
import { assert } from "chai";

describe("PostcodesResource", () => {
  describe("get", () => {
    let client: Client;
    let resource: PostcodeResource;
    const api_key = "foo";
    const query = { api_key };

    beforeEach(() => {
      client = new Client({ ...defaultConfig });
      resource = create(client);
    });

    it("generates API request", () => {
      const { agent } = client;
      enqueue(agent, undefined, toEnqueuedResponse(postcodes.success));
      const http = spy(agent, "http");

      const expectedRequest = {
        method: "GET" as HttpVerb,
        header: Client.defaults.header,
        query,
        timeout: client.timeout,
        url: "https://api.ideal-postcodes.co.uk/v1/postcodes/id11qd",
      };

      resource.get({ postcode: "id11qd", query });

      assert.isTrue(http.calledOnce);
      assert.deepEqual(http.args[0][0], expectedRequest);
    });
    it("returns connection error", () => {});
    it("returns API errors", () => {});
  });
});

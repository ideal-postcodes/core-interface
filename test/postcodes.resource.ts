import * as sinon from "sinon";
import { create } from "../lib/resources/postcodes";
import { Client } from "../lib/client";
import { newConfig } from "./helper/index";

describe("PostcodesResource", () => {
  describe("get", () => {
    const api_key = "foo";
    const query = { api_key };
    const postcode = "id11qd";

    describe("contract", () => {
      it("generates API request on agent", async () => {
        const client = new Client(newConfig());
        const resource = create(client);
        const mock = sinon.mock(client.agent);
        mock
          .expects("http")
          .once()
          .withExactArgs({
            method: "GET",
            header: Client.defaults.header,
            query,
            timeout: client.timeout,
            url: "https://api.ideal-postcodes.co.uk/v1/postcodes/id11qd",
          });
        try {
          await resource.get({ postcode, query });
        } catch (_) {
          // Ignore error as we're just interested in verifying the contract
          // between agent and resource
        }
        mock.verify();
      });
    });

    it("returns postcode data", () => {});
    it("returns non API errors (e.g. connection error)", () => {});
    it("returns API errors", () => {});
  });
});

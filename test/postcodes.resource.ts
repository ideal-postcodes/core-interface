import * as sinon from "sinon";
import { postcodes } from "@ideal-postcodes/api-fixtures";
import { create } from "../lib/resources/postcodes";
import { HttpVerb } from "../lib/agent";
import { Client } from "../lib/client";
import { newConfig, toResponse } from "./helper/index";

describe("PostcodesResource", () => {
  afterEach(() => sinon.restore());

  describe("get", () => {
    const api_key = "foo";
    const query = { api_key };
    const postcode = "id11qd";

    describe("contract", () => {
      it("generates API request on agent", done => {
        const client = new Client(newConfig());
        const resource = create(client);
        const expectedRequest = {
          method: "GET" as HttpVerb,
          header: Client.defaults.header,
          query,
          timeout: client.timeout,
          url: "https://api.ideal-postcodes.co.uk/v1/postcodes/id11qd",
        };
        const stub = sinon
          .stub(client.agent, "http")
          .resolves(toResponse(postcodes.success, expectedRequest));
        resource.get({ postcode, query }).then(() => {
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          done();
        });
      });
    });

    it("returns postcode data", () => {});
    it("returns non API errors (e.g. connection error)", () => {});
    it("returns API errors", () => {});
  });
});

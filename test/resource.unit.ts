import * as sinon from "sinon";
import { retrieveMethod, listMethod } from "../lib/resources/resource";
import { HttpVerb } from "../lib/agent";
import { Client } from "../lib/client";
import { assert } from "chai";
import { newConfig } from "./helper/index";

describe("Resource", () => {
  afterEach(() => sinon.restore());

  const resource = "generic_resource";
  const attribute = "foo";
  const query = { attribute };
  const header = { attribute };
  const client = new Client(newConfig());
  const timeout = 5000;

  describe("retrieveMethod", () => {
    it("generates a function that queries a resource", () => {
      const id = "generic_resource_id";
      const url =
        "https://api.ideal-postcodes.co.uk/v1/generic_resource/generic_resource_id";
      const expectedRequest = {
        method: "GET" as HttpVerb,
        header: { ...Client.defaults.header, ...header },
        query,
        timeout,
        url,
      };
      const expectedResponse = {
        httpRequest: expectedRequest,
        body: {},
        header: {},
        httpStatus: 200,
      };

      const stub = sinon.stub(client.agent, "http").resolves(expectedResponse);

      retrieveMethod({ resource, client })(id, { query, header, timeout }).then(
        response => {
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          assert.deepEqual(response, expectedResponse);
        }
      );
    });
  });

  describe("listMethod", () => {
    it("generates a function that queries a resource", () => {
      const url = "https://api.ideal-postcodes.co.uk/v1/generic_resource";

      const expectedRequest = {
        method: "GET" as HttpVerb,
        header: { ...Client.defaults.header, ...header },
        query,
        timeout,
        url,
      };
      const expectedResponse = {
        httpRequest: expectedRequest,
        body: {},
        header: {},
        httpStatus: 200,
      };

      const stub = sinon.stub(client.agent, "http").resolves(expectedResponse);

      listMethod({ resource, client })({ query, header, timeout }).then(
        response => {
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          assert.deepEqual(response, expectedResponse);
        }
      );
    });
  });
});

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
  const genericRequest = Object.freeze({
    method: "GET" as HttpVerb,
    header: { ...Client.defaults.header, ...header },
    query,
    timeout,
  });
  const genericResponse = Object.freeze({
    body: {},
    header: {},
    httpStatus: 200,
  });
  const resourceOptions = { resource, client };
  const options = { query, header, timeout };

  describe("retrieveMethod", () => {
    it("generates a function that queries a resource", () => {
      const id = "generic_resource_id";
      const url =
        "https://api.ideal-postcodes.co.uk/v1/generic_resource/generic_resource_id";

      const expectedRequest = {
        ...genericRequest,
        url,
      };

      const expectedResponse = {
        ...genericResponse,
        httpRequest: expectedRequest,
      };

      const stub = sinon.stub(client.agent, "http").resolves(expectedResponse);

      retrieveMethod(resourceOptions)(id, options).then((response) => {
        sinon.assert.calledOnce(stub);
        sinon.assert.calledWithExactly(stub, expectedRequest);
        assert.deepEqual(response, expectedResponse);
      });
    });

    it("escapes resource ids", () => {
      const id = "foo bar";
      const url =
        "https://api.ideal-postcodes.co.uk/v1/generic_resource/foo%20bar";

      const expectedRequest = {
        ...genericRequest,
        url,
      };

      const expectedResponse = {
        ...genericResponse,
        httpRequest: expectedRequest,
      };

      const stub = sinon.stub(client.agent, "http").resolves(expectedResponse);

      retrieveMethod(resourceOptions)(id, options).then(() => {
        sinon.assert.calledWithExactly(stub, expectedRequest);
      });
    });
  });

  describe("listMethod", () => {
    it("generates a function that queries a resource", () => {
      const url = "https://api.ideal-postcodes.co.uk/v1/generic_resource";

      const expectedRequest = {
        ...genericRequest,
        url,
      };

      const expectedResponse = {
        ...genericResponse,
        httpRequest: expectedRequest,
      };

      const stub = sinon.stub(client.agent, "http").resolves(expectedResponse);

      listMethod(resourceOptions)(options).then((response) => {
        sinon.assert.calledOnce(stub);
        sinon.assert.calledWithExactly(stub, expectedRequest);
        assert.deepEqual(response, expectedResponse);
      });
    });
  });
});

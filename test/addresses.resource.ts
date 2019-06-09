import * as sinon from "sinon";
import { IdpcRequestFailedError, IdpcBalanceDepletedError } from "../lib/error";
import { addresses, errors } from "@ideal-postcodes/api-fixtures";
import { create, AddressResource } from "../lib/resources/addresses";
import { HttpVerb } from "../lib/agent";
import { Client } from "../lib/client";
import { assert } from "chai";
import { newConfig, toResponse } from "./helper/index";

describe("AddressesResource", () => {
  afterEach(() => sinon.restore());

  const api_key = "foo";
  const address = "10 downing street";
  const query = { api_key, query: address };
  const client = new Client(newConfig());
  const expectedRequest = {
    method: "GET" as HttpVerb,
    header: Client.defaults.header,
    query,
    timeout: client.timeout,
    url: "https://api.ideal-postcodes.co.uk/v1/addresses",
  };

  let resource: AddressResource;

  beforeEach(() => {
    resource = create(client);
  });

  describe("contract", () => {
    it("generates API request on agent", done => {
      const stub = sinon
        .stub(client.agent, "http")
        .resolves(toResponse(addresses.success, expectedRequest));

      resource.list({ query }).then(() => {
        sinon.assert.calledOnce(stub);
        sinon.assert.calledWithExactly(stub, expectedRequest);
        done();
      });
    });
  });

  it("returns address data", done => {
    sinon
      .stub(client.agent, "http")
      .resolves(toResponse(addresses.success, expectedRequest));

    resource.list({ query }).then(response => {
      assert.deepEqual(response.body, addresses.success.body);
      done();
    });
  });

  it("returns non API errors (e.g. connection error)", done => {
    sinon.stub(client.agent, "http").rejects(new Error("timeout!"));

    resource
      .list({ query })
      .then(() => {
        done(new Error("Promise should be rejected"));
      })
      .catch(error => {
        assert.instanceOf(error, Error);
        done();
      });
  });

  it("returns API errors", done => {
    sinon
      .stub(client.agent, "http")
      .resolves(toResponse(errors.balanceDepleted, expectedRequest));

    resource
      .list({ query })
      .then(() => done(new Error("Promise should be rejected")))
      .catch(error => {
        assert.isTrue(error instanceof IdpcRequestFailedError);
        assert.instanceOf(error, IdpcBalanceDepletedError);
        done();
      });
  });
});

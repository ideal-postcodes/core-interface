import * as sinon from "sinon";
import { IdpcRequestFailedError, IdpcBalanceDepletedError } from "../lib/error";
import { errors, autocomplete } from "@ideal-postcodes/api-fixtures";
import { create, AutocompleteResource } from "../lib/resources/autocomplete";
import { HttpVerb } from "../lib/agent";
import { Client } from "../lib/client";
import { assert } from "chai";
import { newConfig, toResponse } from "./helper/index";

describe("AutocompleteResource", () => {
  afterEach(() => sinon.restore());

  const api_key = "foo";
  const address = "10 downing str";
  const query = { api_key, query: address };
  const client = new Client(newConfig());
  const expectedRequest = {
    method: "GET" as HttpVerb,
    header: Client.defaults.header,
    query,
    timeout: client.timeout,
    url: "https://api.ideal-postcodes.co.uk/v1/autocomplete/addresses",
  };

  let resource: AutocompleteResource;

  beforeEach(() => {
    resource = create(client);
  });

  describe("contract", () => {
    it("generates API request on agent", done => {
      const stub = sinon
        .stub(client.agent, "http")
        .resolves(toResponse(autocomplete.success, expectedRequest));

      resource.list({ query }).then(() => {
        sinon.assert.calledOnce(stub);
        sinon.assert.calledWithExactly(stub, expectedRequest);
        done();
      });
    });
  });

  it("returns address suggestion data", done => {
    sinon
      .stub(client.agent, "http")
      .resolves(toResponse(autocomplete.success, expectedRequest));

    resource.list({ query }).then(response => {
      assert.deepEqual(response.body, autocomplete.success.body);
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
        assert.instanceOf(error, IdpcBalanceDepletedError);
        assert.isTrue(error instanceof IdpcRequestFailedError);
        done();
      });
  });
});

import * as sinon from "sinon";
import { IdpcRequestFailedError, IdpcBalanceDepletedError } from "../lib/error";
import { addresses as fixtures, errors } from "@ideal-postcodes/api-fixtures";
import { list } from "../lib/resources/addresses";
import { HttpVerb } from "../lib/agent";
import { Client, defaults } from "../lib/index";
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
    header: defaults.header,
    query,
    timeout: client.config.timeout,
    url: "https://api.ideal-postcodes.co.uk/v1/addresses",
  };

  describe("contract", () => {
    it("generates API request on agent", (done) => {
      const stub = sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(fixtures.success, expectedRequest));

      list(client, { query }).then(() => {
        sinon.assert.calledOnce(stub);
        sinon.assert.calledWithExactly(stub, expectedRequest);
        done();
      });
    });
  });

  it("returns address data", (done) => {
    sinon
      .stub(client.config.agent, "http")
      .resolves(toResponse(fixtures.success, expectedRequest));

    list(client, { query }).then((response) => {
      //@ts-ignore
      assert.deepEqual(response.body, fixtures.success.body);
      done();
    });
  });

  it("returns non API errors (e.g. connection error)", (done) => {
    sinon.stub(client.config.agent, "http").rejects(new Error("timeout!"));

    list(client, { query })
      .then(() => {
        done(new Error("Promise should be rejected"));
      })
      .catch((error) => {
        assert.instanceOf(error, Error);
        done();
      });
  });

  it("returns API errors", (done) => {
    sinon
      .stub(client.config.agent, "http")
      .resolves(toResponse(errors.balanceDepleted, expectedRequest));

    list(client, { query })
      .then(() => done(new Error("Promise should be rejected")))
      .catch((error) => {
        assert.isTrue(error instanceof IdpcRequestFailedError);
        assert.instanceOf(error, IdpcBalanceDepletedError);
        done();
      });
  });
});

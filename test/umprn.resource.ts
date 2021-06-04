import * as sinon from "sinon";
import { IdpcUmprnNotFoundError } from "../lib/error";
import { umprn as umprnFixtures } from "@ideal-postcodes/api-fixtures";
import { retrieve } from "../lib/resources/umprn";
import { HttpVerb } from "../lib/agent";
import { Client, defaults } from "../lib/client";
import { assert } from "chai";
import { newConfig, toResponse } from "./helper/index";

describe("UmprnResource", () => {
  afterEach(() => sinon.restore());

  describe("retrieve", () => {
    const api_key = "foo";
    const query = { api_key };
    const umprn = 8;
    const client = new Client(newConfig());
    const expectedRequest = {
      method: "GET" as HttpVerb,
      header: defaults.header,
      query,
      timeout: client.config.timeout,
      url: "https://api.ideal-postcodes.co.uk/v1/umprn/8",
    };

    describe("contract", () => {
      it("generates API request on agent", (done) => {
        const stub = sinon
          .stub(client.config.agent, "http")
          .resolves(toResponse(umprnFixtures.success, expectedRequest));

        retrieve(client, umprn.toString(), { query }).then(() => {
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          done();
        });
      });
    });

    it("returns address data", (done) => {
      sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(umprnFixtures.success, expectedRequest));

      retrieve(client, umprn.toString(), { query }).then((response) => {
        assert.deepEqual(response.body, umprnFixtures.success.body);
        done();
      });
    });

    it("returns non API errors (e.g. connection error)", (done) => {
      sinon.stub(client.config.agent, "http").rejects(new Error("timeout!"));

      retrieve(client, umprn.toString(), { query })
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
        .resolves(toResponse(umprnFixtures.notFound, expectedRequest));

      retrieve(client, umprn.toString(), { query })
        .then(() => done(new Error("Promise should be rejected")))
        .catch((error) => {
          assert.instanceOf(error, IdpcUmprnNotFoundError);
          done();
        });
    });
  });
});

import * as sinon from "sinon";
import { IdpcPostcodeNotFoundError } from "../lib/error";
import { postcodes as fixtures } from "@ideal-postcodes/api-fixtures";
import { retrieve } from "../lib/resources/postcodes";
import { HttpVerb } from "../lib/agent";
import { Client, defaults } from "../lib/client";
import { assert } from "chai";
import { newConfig, toResponse } from "./helper/index";

describe("PostcodesResource", () => {
  afterEach(() => sinon.restore());

  describe("retrieve", () => {
    const api_key = "foo";
    const query = { api_key };
    const postcode = "id11qd";
    const client = new Client(newConfig());
    const expectedRequest = {
      method: "GET" as HttpVerb,
      header: defaults.header,
      query,
      timeout: client.config.timeout,
      url: "https://api.ideal-postcodes.co.uk/v1/postcodes/id11qd",
    };

    describe("contract", () => {
      it("generates API request on agent", (done) => {
        const stub = sinon
          .stub(client.config.agent, "http")
          .resolves(toResponse(fixtures.success, expectedRequest));

        retrieve(client, postcode, { query }).then(() => {
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          done();
        });
      });
    });

    it("returns postcode data", (done) => {
      sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(fixtures.success, expectedRequest));

      retrieve(client, postcode, { query }).then((response) => {
        assert.deepEqual(response.body, fixtures.success.body);
        done();
      });
    });

    it("returns non API errors (e.g. connection error)", (done) => {
      sinon.stub(client.config.agent, "http").rejects(new Error("timeout!"));

      retrieve(client, postcode, { query })
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
        .resolves(toResponse(fixtures.notFound, expectedRequest));

      retrieve(client, postcode, { query })
        .then(() => done(new Error("Promise should be rejected")))
        .catch((error) => {
          assert.instanceOf(error, IdpcPostcodeNotFoundError);
          done();
        });
    });
  });
});

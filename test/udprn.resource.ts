import * as sinon from "sinon";
import { IdpcUdprnNotFoundError } from "../lib/error";
import { udprn as udprnFixtures } from "@ideal-postcodes/api-fixtures";
import { retrieve } from "../lib/resources/udprn";
import { HttpVerb } from "../lib/agent";
import { Client, defaults } from "../lib/client";
import { assert } from "chai";
import { newConfig, toResponse } from "./helper/index";

describe("UdprnResource", () => {
  afterEach(() => sinon.restore());

  describe("retrieve", () => {
    const api_key = "foo";
    const query = { api_key };
    const udprn = 8;
    const client = new Client(newConfig());
    const expectedRequest = {
      method: "GET" as HttpVerb,
      header: defaults.header,
      query,
      timeout: client.config.timeout,
      url: "https://api.ideal-postcodes.co.uk/v1/udprn/8",
    };

    describe("contract", () => {
      it("generates API request on agent", (done) => {
        const stub = sinon
          .stub(client.config.agent, "http")
          .resolves(toResponse(udprnFixtures.success, expectedRequest));

        retrieve(client, udprn.toString(), { query }).then(() => {
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          done();
        });
      });
    });

    it("returns address data", (done) => {
      sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(udprnFixtures.success, expectedRequest));

      retrieve(client, udprn.toString(), { query }).then((response) => {
        //@ts-ignore
        assert.deepEqual(response.body, udprnFixtures.success.body);
        done();
      });
    });

    it("returns non API errors (e.g. connection error)", (done) => {
      sinon.stub(client.config.agent, "http").rejects(new Error("timeout!"));

      retrieve(client, udprn.toString(), { query })
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
        .resolves(toResponse(udprnFixtures.notFound, expectedRequest));

      retrieve(client, udprn.toString(), { query })
        .then(() => done(new Error("Promise should be rejected")))
        .catch((error) => {
          assert.instanceOf(error, IdpcUdprnNotFoundError);
          done();
        });
    });
  });
});

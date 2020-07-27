import * as sinon from "sinon";
import { IdpcUdprnNotFoundError } from "../lib/error";
import { udprn as udprnFixtures } from "@ideal-postcodes/api-fixtures";
import { create, UdprnResource } from "../lib/resources/udprn";
import { HttpVerb } from "../lib/agent";
import { Client } from "../lib/client";
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
      header: Client.defaults.header,
      query,
      timeout: client.timeout,
      url: "https://api.ideal-postcodes.co.uk/v1/udprn/8",
    };

    let resource: UdprnResource;

    beforeEach(() => {
      resource = create(client);
    });

    describe("contract", () => {
      it("generates API request on agent", (done) => {
        const stub = sinon
          .stub(client.agent, "http")
          .resolves(toResponse(udprnFixtures.success, expectedRequest));

        resource.retrieve(udprn.toString(), { query }).then(() => {
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          done();
        });
      });
    });

    it("returns address data", (done) => {
      sinon
        .stub(client.agent, "http")
        .resolves(toResponse(udprnFixtures.success, expectedRequest));

      resource.retrieve(udprn.toString(), { query }).then((response) => {
        assert.deepEqual(response.body, udprnFixtures.success.body);
        done();
      });
    });

    it("returns non API errors (e.g. connection error)", (done) => {
      sinon.stub(client.agent, "http").rejects(new Error("timeout!"));

      resource
        .retrieve(udprn.toString(), { query })
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
        .stub(client.agent, "http")
        .resolves(toResponse(udprnFixtures.notFound, expectedRequest));

      resource
        .retrieve(udprn.toString(), { query })
        .then(() => done(new Error("Promise should be rejected")))
        .catch((error) => {
          assert.instanceOf(error, IdpcUdprnNotFoundError);
          done();
        });
    });
  });
});

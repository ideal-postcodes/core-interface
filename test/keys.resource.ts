import * as sinon from "sinon";
import { IdpcKeyNotFoundError } from "../lib/error";
import { keys } from "@ideal-postcodes/api-fixtures";
import { retrieve, usage } from "../lib/resources/keys";
import { HttpVerb } from "../lib/agent";
import { Client, defaults } from "../lib/client";
import { assert } from "chai";
import { newConfig, toResponse } from "./helper/index";

describe("KeyResource", () => {
  afterEach(() => sinon.restore());

  describe("public key information", () => {
    describe("retrieve", () => {
      const query = {};
      const key = "iddqd";
      const client = new Client(newConfig());
      const expectedRequest = {
        method: "GET" as HttpVerb,
        header: defaults.header,
        query,
        timeout: client.config.timeout,
        url: "https://api.ideal-postcodes.co.uk/v1/keys/iddqd",
      };

      describe("contract", () => {
        it("generates API request on agent", (done) => {
          const stub = sinon
            .stub(client.config.agent, "http")
            .resolves(toResponse(keys.check.available, expectedRequest));

          retrieve(client, key, { query }).then(() => {
            sinon.assert.calledOnce(stub);
            sinon.assert.calledWithExactly(stub, expectedRequest);
            done();
          });
        });
      });

      it("returns key available", (done) => {
        sinon
          .stub(client.config.agent, "http")
          .resolves(toResponse(keys.check.available, expectedRequest));

        retrieve(client, key, { query }).then((response) => {
          assert.deepEqual(response.body, keys.check.available.body);
          done();
        });
      });

      it("returns key unavailable", (done) => {
        sinon
          .stub(client.config.agent, "http")
          .resolves(toResponse(keys.check.unavailable, expectedRequest));

        retrieve(client, key, { query }).then((response) => {
          assert.deepEqual(response.body, keys.check.unavailable.body);
          done();
        });
      });

      it("returns non API errors (e.g. connection error)", (done) => {
        sinon.stub(client.config.agent, "http").rejects(new Error("timeout!"));

        retrieve(client, key, { query })
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
          .resolves(toResponse(keys.check.invalid, expectedRequest));

        retrieve(client, key, { query })
          .then(() => done(new Error("Promise should be rejected")))
          .catch((error) => {
            assert.instanceOf(error, IdpcKeyNotFoundError);
            done();
          });
      });
    });
  });

  describe("private key information", () => {
    describe("retrieve", () => {
      const user_token = "secretfoo";
      const query = { user_token };
      const key = "iddqd";
      const client = new Client(newConfig());
      const expectedRequest = {
        method: "GET" as HttpVerb,
        header: defaults.header,
        query,
        timeout: client.config.timeout,
        url: "https://api.ideal-postcodes.co.uk/v1/keys/iddqd",
      };

      describe("contract", () => {
        it("generates API request on agent", (done) => {
          const stub = sinon
            .stub(client.config.agent, "http")
            .resolves(toResponse(keys.private.success, expectedRequest));

          retrieve(client, key, { query }).then(() => {
            sinon.assert.calledOnce(stub);
            sinon.assert.calledWithExactly(stub, expectedRequest);
            done();
          });
        });
      });

      it("returns key available", (done) => {
        sinon
          .stub(client.config.agent, "http")
          .resolves(toResponse(keys.private.success, expectedRequest));

        retrieve(client, key, { query }).then((response) => {
          assert.deepEqual(response.body, keys.private.success.body);
          done();
        });
      });

      it("returns API errors", (done) => {
        sinon
          .stub(client.config.agent, "http")
          .resolves(toResponse(keys.check.invalid, expectedRequest));

        retrieve(client, key, { query })
          .then(() => done(new Error("Promise should be rejected")))
          .catch((error) => {
            assert.instanceOf(error, IdpcKeyNotFoundError);
            done();
          });
      });
    });

    describe("usage", () => {
      const user_token = "secretfoo";
      const query = { user_token };
      const key = "iddqd";
      const client = new Client(newConfig());
      const expectedRequest = {
        method: "GET" as HttpVerb,
        header: defaults.header,
        query,
        timeout: client.config.timeout,
        url: "https://api.ideal-postcodes.co.uk/v1/keys/iddqd/usage",
      };

      describe("contract", () => {
        it("generates API request on agent", (done) => {
          const stub = sinon
            .stub(client.config.agent, "http")
            .resolves(toResponse(keys.usage.success, expectedRequest));

          usage(client, key, { query }).then(() => {
            sinon.assert.calledOnce(stub);
            sinon.assert.calledWithExactly(stub, expectedRequest);
            done();
          });
        });
      });

      it("returns key usage data", (done) => {
        sinon
          .stub(client.config.agent, "http")
          .resolves(toResponse(keys.usage.success, expectedRequest));

        usage(client, key, { query }).then((response) => {
          assert.deepEqual(response.body, keys.usage.success.body);
          done();
        });
      });
    });
  });
});

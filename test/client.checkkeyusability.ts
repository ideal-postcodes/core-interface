import { assert } from "chai";
import * as sinon from "sinon";
import { Client, defaults } from "../lib/client";
import { checkKeyUsability } from "../lib/index";
import { HttpRequest } from "../lib/agent";
import { keys as fixtures } from "@ideal-postcodes/api-fixtures";
import { toResponse, newConfig } from "./helper/index";
import { IdpcKeyNotFoundError } from "../lib/error";

describe("Client", () => {
  afterEach(() => sinon.restore());

  describe("checkKeyUsability", () => {
    const client = new Client(newConfig());
    const timeout = client.config.timeout;
    const header = { ...defaults.header };
    const query = {};
    const method = "GET";

    it("returns true if key avaialble", (done) => {
      const expectedRequest: HttpRequest = {
        method,
        timeout,
        query,
        header,
        url: "https://api.ideal-postcodes.co.uk/v1/keys/iddqd",
      };

      const stub = sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(fixtures.check.available, expectedRequest));

      const api_key = "iddqd";

      checkKeyUsability({ api_key, client })
        .then((keyStatus) => {
          assert.deepEqual(fixtures.check.available.body.result, keyStatus);
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          done();
        })
        .catch((error) => done(error));
    });

    it("defaults to key defined in client", (done) => {
      const expectedRequest: HttpRequest = {
        method,
        timeout,
        query,
        header,
        url: `https://api.ideal-postcodes.co.uk/v1/keys/${client.config.api_key}`,
      };

      const stub = sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(fixtures.check.available, expectedRequest));

      checkKeyUsability({ client })
        .then((keyStatus) => {
          assert.deepEqual(fixtures.check.available.body.result, keyStatus);
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          done();
        })
        .catch((error) => done(error));
    });

    it("applies licensee", (done) => {
      const licensee = "baz";
      const expectedRequest: HttpRequest = {
        method,
        timeout,
        query: { licensee },
        header,
        url: `https://api.ideal-postcodes.co.uk/v1/keys/${client.config.api_key}`,
      };

      const stub = sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(fixtures.check.available, expectedRequest));

      checkKeyUsability({ client, licensee })
        .then((keyStatus) => {
          assert.deepEqual(fixtures.check.available.body.result, keyStatus);
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          done();
        })
        .catch((error) => done(error));
    });

    it("applies timeout", (done) => {
      const t = 88;
      const expectedRequest: HttpRequest = {
        method,
        timeout: t,
        query,
        header,
        url: `https://api.ideal-postcodes.co.uk/v1/keys/${client.config.api_key}`,
      };

      const stub = sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(fixtures.check.available, expectedRequest));

      checkKeyUsability({ client, timeout: t })
        .then((keyStatus) => {
          assert.deepEqual(fixtures.check.available.body.result, keyStatus);
          sinon.assert.calledOnce(stub);
          sinon.assert.calledWithExactly(stub, expectedRequest);
          done();
        })
        .catch((error) => done(error));
    });

    it("returns false if key is not available", (done) => {
      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout: client.config.timeout,
        query: {},
        header: { ...defaults.header },
        url: "https://api.ideal-postcodes.co.uk/v1/keys/idkfa",
      };

      sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(fixtures.check.unavailable, expectedRequest));

      const api_key = "idkfa";

      checkKeyUsability({ client, api_key })
        .then((keyStatus) => {
          assert.isFalse(keyStatus.available);
          done();
        })
        .catch((error) => done(error));
    });

    it("`catches` for all other errors", (done) => {
      const expectedRequest: HttpRequest = {
        method: "GET",
        timeout: client.config.timeout,
        query: {},
        header: { ...defaults.header },
        url: "https://api.ideal-postcodes.co.uk/v1/keys/foo",
      };

      sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(fixtures.check.invalid, expectedRequest));

      const api_key = "foo";

      checkKeyUsability({ client, api_key })
        .then(() => done(new Error("This test should throw")))
        .catch((error) => {
          assert.instanceOf(error, IdpcKeyNotFoundError);
          done();
        });
    });
  });
});

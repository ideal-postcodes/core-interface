import * as sinon from "sinon";
import { ping, Client } from "../lib/index";
import { newConfig, defaultResponse } from "./helper/index";
import { HttpVerb } from "../lib/agent";

describe("ping", () => {
  afterEach(() => sinon.restore());
  it("requests '/'", (done) => {
    const client = new Client(newConfig());
    const expectedRequest = {
      method: "GET" as HttpVerb,
      header: {},
      query: {},
      timeout: client.config.timeout,
      url: `${client.protocol()}://${client.config.baseUrl}/`,
    };

    const stub = sinon
      .stub(client.config.agent, "http")
      .resolves(defaultResponse);

    ping(client).then(() => {
      sinon.assert.calledOnce(stub);
      sinon.assert.calledWithExactly(stub, expectedRequest);
      done();
    });
  });
});

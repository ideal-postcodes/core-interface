import * as sinon from "sinon";
import { HttpVerb } from "../lib/agent";
import { Client } from "../lib/client";
import { assert } from "chai";
//import { newConfig } from './helper/index';
import { newConfig, toResponse } from "./helper/index";
//import { AddressSuggestionResponse } from "@ideal-postcodes/api-typings";
import { autocomplete } from "@ideal-postcodes/api-fixtures";
//import { errors, autocomplete } from "@ideal-postcodes/api-fixtures";

describe('Autocomplete2', function() {
  
  const address = "10 downing str";
  const query = { query: address };
  const client = new Client(newConfig());
  const expectedRequest = {
    method: "GET" as HttpVerb,
    header: Client.defaults.header,
    query,
    timeout: client.timeout,
    url: "https://api.ideal-postcodes.co.uk/v1/autocomplete/addresses",
  };
  
  afterEach(() => sinon.restore());
  
  it('Promise Success', async () => {
    const stub = sinon
    .stub(client.agent, "http")
    .resolves(toResponse(autocomplete.success, expectedRequest));
    await client.autocompleteAddress(query);
    sinon.assert.calledOnce(stub);
    sinon.assert.calledWithExactly(stub, expectedRequest);
  });
  
  it('Registered Callback Success', (done) => {
    const stub = sinon
    .stub(client.agent, "http")
    .resolves(toResponse(autocomplete.success, expectedRequest));
    const callback = (error: any, result: any) => {
      sinon.assert.calledOnce(stub);
      sinon.assert.calledWithExactly(stub, expectedRequest);
      assert.equal(error, null);
      assert.notDeepEqual(result, null);
      done();
    }
    try {
      client.registerAutocompleteCallback(callback);
      client.autocompleteAddress(query);
    } catch (e) {
      console.log()
      done(e);
    }
  });
  
});
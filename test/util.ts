import { Client } from "../lib/client";
import { newConfig } from "./helper/index";
import { AddressKeys } from "../lib/types";
import {
  toStringMap,
  appendPage,
  toTimeout,
  appendTags,
  toHeader,
  appendFilter,
  toAuthHeader,
  appendAuthorization,
  appendIp,
  debounce,
} from "../lib/util";
import { assert } from "chai";

const defaultHeader = Object.freeze({ ...Client.defaults.header });

describe("toStringMap", () => {
  it("shallow clones an object omitting non string values", () => {
    assert.deepEqual(
      toStringMap({
        foo: "bar",
        baz: undefined,
      }),
      {
        foo: "bar",
      }
    );
  });
  it("returns empty object if undefined", () => {
    assert.deepEqual(toStringMap(), {});
  });
});

describe("toHeader", () => {
  it("generates header object assigning greatest precedence to request header", () => {
    const client = new Client({ ...newConfig() });
    const header = { Accept: "foo", bar: undefined, baz: "quux" };

    assert.deepEqual(toHeader({ header }, client), {
      Accept: "foo",
      baz: "quux",
      "Content-Type": defaultHeader["Content-Type"],
    });
  });
  it("applies client default headers with lower precedence vis request", () => {
    const client = new Client({ ...newConfig() });
    const header = { bar: undefined, baz: "quux" };

    assert.deepEqual(toHeader({ header }, client), {
      Accept: defaultHeader.Accept,
      baz: "quux",
      "Content-Type": defaultHeader["Content-Type"],
    });
  });

  it("applies client default headers if request header undefined", () => {
    const client = new Client({ ...newConfig() });
    assert.deepEqual(toHeader({}, client), {
      Accept: defaultHeader.Accept,
      "Content-Type": defaultHeader["Content-Type"],
    });
  });
});

describe("toTimeout", () => {
  it("returns request timeout", () => {
    const client = new Client({ ...newConfig() });
    const timeout = 888;
    const request = { timeout };
    assert.equal(toTimeout(request, client), timeout);
  });

  it("returns client timeout if not specified in request", () => {
    const client = new Client({ ...newConfig() });
    const request = {};
    assert.equal(toTimeout(request, client), client.timeout);
  });
});

describe("toAuthHeader", () => {
  const client = new Client({ ...newConfig() });

  it("uses client api key by default", () => {
    assert.equal(
      toAuthHeader(client, {}),
      `IDEALPOSTCODES api_key="${client.api_key}"`
    );
  });

  it("allow provides precedence to api_key in options", () => {
    const api_key = "foobar";
    assert.equal(
      toAuthHeader(client, { api_key }),
      `IDEALPOSTCODES api_key="${api_key}"`
    );
  });

  it("allows user_token", () => {
    const user_token = "foobar";
    assert.equal(
      toAuthHeader(client, { user_token }),
      `IDEALPOSTCODES api_key="${client.api_key}" user_token="${user_token}"`
    );
  });

  it("allows licensee", () => {
    const licensee = "foobar";
    assert.equal(
      toAuthHeader(client, { licensee }),
      `IDEALPOSTCODES api_key="${client.api_key}" licensee="${licensee}"`
    );
  });

  it("allows a combination of all authorisation attributes", () => {
    const api_key = "api_foobar";
    const user_token = "user_foobar";
    const licensee = "licensee_foobar";
    assert.equal(
      toAuthHeader(client, { licensee, api_key, user_token }),
      `IDEALPOSTCODES api_key="${api_key}" licensee="${licensee}" user_token="${user_token}"`
    );
  });
});

describe("appendAuthorization", () => {
  const client = new Client({ ...newConfig() });

  it("mutates a headers object to include authorization", () => {
    const header = {};
    const options = {};
    const result = appendAuthorization({ header, client, options });
    assert.equal(header, result);
    assert.equal(
      result.Authorization,
      `IDEALPOSTCODES api_key="${client.api_key}"`
    );
  });
});

describe("appendIp", () => {
  it("appends IDPC-Source-IP to request header", () => {
    const header = {};
    const options = { sourceIp: "8.8.8.8" };
    const result = appendIp({ header, options });
    assert.equal(header, result);
    assert.equal(result["IDPC-Source-IP"], "8.8.8.8");
  });
  it("does not change headers if left unspecified", () => {
    const header = {};
    const options = {};
    const result = appendIp({ header, options });
    assert.deepEqual(result, {});
  });
});

describe("appendFilter", () => {
  it("appends filter to query object", () => {
    const query = {};
    const filter = ["line_1", "postcode"] as AddressKeys[];
    const options = { filter };
    const result = appendFilter({ query, options });
    assert.equal(query, result);
    assert.equal(result.filter, "line_1,postcode");
  });

  it("does not change headers if left unspecified", () => {
    const query = {};
    const options = {};
    const result = appendFilter({ query, options });
    assert.deepEqual(result, {});
  });
});

describe("appendTags", () => {
  it("appends tags to query object", () => {
    const query = {};
    const tags = ["foo", "bar"];
    const options = { tags };
    const result = appendTags({ query, options });
    assert.equal(query, result);
    assert.equal(result.tags, "foo,bar");
  });

  it("does not change headers if left unspecified", () => {
    const query = {};
    const options = {};
    const result = appendTags({ query, options });
    assert.deepEqual(result, {});
  });
});

describe("appendPage", () => {
  it("appends page to query object", () => {
    const query = {};
    const page = 1;
    const options = { page };
    const result = appendPage({ query, options });
    assert.equal(query, result);
    assert.equal(result.page, "1");
  });

  it("appends limit to query object", () => {
    const query = {};
    const limit = 2;
    const options = { limit };
    const result = appendPage({ query, options });
    assert.equal(query, result);
    assert.equal(result.limit, "2");
  });

  it("does not change headers if left unspecified", () => {
    const query = {};
    const options = {};
    const result = appendPage({ query, options });
    assert.deepEqual(result, {});
  });
});

describe("debounce", () => {
  it("debounces function", done => {
    let count = 0;
    const finish = () => {
      assert.equal(count, 1);
      done();
    };
    const debouncedMethod = debounce(() => {
      count += 1;
      finish();
    });
    debouncedMethod();
    debouncedMethod();
    debouncedMethod();
  });
});

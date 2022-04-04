import * as sinon from "sinon";
import { IdpcRequestFailedError, IdpcBalanceDepletedError } from "../lib/error";
import { errors, autocomplete } from "@ideal-postcodes/api-fixtures";
import { list, gbr, usa } from "../lib/resources/autocomplete";
import { HttpVerb } from "../lib/agent";
import { Client, defaults } from "../lib/index";
import { assert } from "chai";
import { newConfig, toResponse } from "./helper/index";

describe("AutocompleteResource: List", () => {
  afterEach(() => sinon.restore());

  const api_key = "foo";
  const address = "10 downing str";
  const query = { api_key, query: address };
  const client = new Client(newConfig());
  const expectedRequest = {
    method: "GET" as HttpVerb,
    header: defaults.header,
    query,
    timeout: client.config.timeout,
    url: "https://api.ideal-postcodes.co.uk/v1/autocomplete/addresses",
  };

  describe("contract", () => {
    it("generates API request on agent", (done) => {
      const stub = sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(autocomplete.success, expectedRequest));

      list(client, { query }).then(() => {
        sinon.assert.calledOnce(stub);
        sinon.assert.calledWithExactly(stub, expectedRequest);
        done();
      });
    });
  });

  it("returns address suggestion data", (done) => {
    sinon
      .stub(client.config.agent, "http")
      .resolves(toResponse(autocomplete.success, expectedRequest));

    list(client, { query }).then((response) => {
      //@ts-ignore
      assert.deepEqual(response.body, autocomplete.success.body);
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
        assert.instanceOf(error, IdpcBalanceDepletedError);
        assert.isTrue(error instanceof IdpcRequestFailedError);
        done();
      });
  });
});

describe("AutocompleteResource: Resolve GBR", () => {
  const fixture = {
    description: "UDPRN address retrieval",
    url: "/v1/autocomplete/addresses/paf_23747208/gbr",
    query: {
      api_key: "<VALID_API_KEY>",
    },
    headers: {},
    httpStatus: 200,
    body: {
      result: {
        postcode: "SW1A 0AA",
        postcode_inward: "0AA",
        postcode_outward: "SW1A",
        post_town: "LONDON",
        dependant_locality: "",
        double_dependant_locality: "",
        thoroughfare: "",
        dependant_thoroughfare: "",
        building_number: "",
        building_name: "Houses Of Parliament",
        sub_building_name: "",
        po_box: "",
        department_name: "",
        organisation_name: "House Of Commons",
        udprn: 23747208,
        umprn: "",
        postcode_type: "L",
        su_organisation_indicator: "",
        delivery_point_suffix: "1A",
        line_1: "House Of Commons",
        line_2: "Houses Of Parliament",
        line_3: "",
        premise: "Houses Of Parliament",
        longitude: -0.1246375,
        latitude: 51.4998415,
        eastings: 530268,
        northings: 179545,
        country: "England",
        traditional_county: "Greater London",
        administrative_county: "",
        postal_county: "London",
        county: "London",
        district: "Westminster",
        ward: "St James's",
        uprn: "10033540874",
        dataset: "paf",
        id: "paf_23747208",
        country_iso: "GBR",
      },
      code: 2000,
      message: "Success",
    },
  };

  afterEach(() => sinon.restore());

  const api_key = "foo";
  const id = "paf_123456";
  const query = { api_key };
  const client = new Client(newConfig());
  const expectedRequest = {
    method: "GET" as HttpVerb,
    header: defaults.header,
    query,
    timeout: client.config.timeout,
    url: `https://api.ideal-postcodes.co.uk/v1/autocomplete/addresses/${id}/gbr`,
  };

  describe("contract", () => {
    it("generates API request on agent", (done) => {
      const stub = sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(fixture, expectedRequest));

      gbr(client, id, { query }).then(() => {
        sinon.assert.calledOnce(stub);
        sinon.assert.calledWithExactly(stub, expectedRequest);
        done();
      });
    });
  });

  it("returns resolved address", (done) => {
    sinon
      .stub(client.config.agent, "http")
      .resolves(toResponse(fixture, expectedRequest));

    gbr(client, id, { query }).then((response) => {
      //@ts-ignore
      assert.deepEqual(response.body, fixture.body);
      done();
    });
  });

  it("returns non API errors (e.g. connection error)", (done) => {
    sinon.stub(client.config.agent, "http").rejects(new Error("timeout!"));

    gbr(client, id, { query })
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

    gbr(client, id, { query })
      .then(() => done(new Error("Promise should be rejected")))
      .catch((error) => {
        assert.instanceOf(error, IdpcBalanceDepletedError);
        assert.isTrue(error instanceof IdpcRequestFailedError);
        done();
      });
  });
});

describe("AutocompleteResource: Resolve USA", () => {
  const fixture = {
    description: "USA address retrieval",
    url: "/v1/autocomplete/addresses/usps_Y115641805%7C10%7C%7C7254/usa",
    query: {
      api_key: "<VALID_API_KEY>",
    },
    headers: {},
    httpStatus: 200,
    body: {
      result: {
        primary_number: "10",
        secondary_number: "",
        plus_4_code: "7254",
        line_1: "10 A A Dr",
        line_2: "",
        last_line: "Taylorsville NC 28681-7254",
        zip_plus_4_code: "28681-7254",
        id: "usps_Y115641805|10||7254",
        dataset: "usps",
        country_iso: "USA",
        country: "United States",
        update_key_number: "Y115641805",
        zip_code: "28681",
        record_type_code: "S",
        carrier_route_id: "R008",
        street_pre_directional_abbreviation: "",
        street_name: "A A",
        street_suffix_abbreviation: "Dr",
        street_post_directional_abbreviation: "",
        building_or_firm_name: "",
        base_alternate_code: "B",
        lacs_status_indicator: "",
        government_building_indicator: "",
        state_abbreviation: "NC",
        municipality_city_state_key: "",
        state: "North Carolina",
        urbanization_city_state_key: "",
        preferred_last_line_city_state_key: "Y16602",
        address_secondary_abbreviation: "",
        county: "Alexander",
        city: "Taylorsville",
        city_abbreviation: "",
        preferred_city: "Taylorsville",
        city_state_name_facility_code: "P",
        zip_classification_code: "",
        city_state_mailing_name_indicator: "Y",
        carrier_route_rate_sortation: "D",
        finance_number: 367712,
        congressional_district_number: 5,
        county_number: 3,
      },
      code: 2000,
      message: "Success",
    },
  };

  afterEach(() => sinon.restore());

  const api_key = "foo";
  const id = "paf_123456";
  const query = { api_key };
  const client = new Client(newConfig());
  const expectedRequest = {
    method: "GET" as HttpVerb,
    header: defaults.header,
    query,
    timeout: client.config.timeout,
    url: `https://api.ideal-postcodes.co.uk/v1/autocomplete/addresses/${id}/usa`,
  };

  describe("contract", () => {
    it("generates API request on agent", (done) => {
      const stub = sinon
        .stub(client.config.agent, "http")
        .resolves(toResponse(fixture, expectedRequest));

      usa(client, id, { query }).then(() => {
        sinon.assert.calledOnce(stub);
        sinon.assert.calledWithExactly(stub, expectedRequest);
        done();
      });
    });
  });

  it("returns resolved address", (done) => {
    sinon
      .stub(client.config.agent, "http")
      .resolves(toResponse(fixture, expectedRequest));

    usa(client, id, { query }).then((response) => {
      //@ts-ignore
      assert.deepEqual(response.body, fixture.body);
      done();
    });
  });

  it("returns non API errors (e.g. connection error)", (done) => {
    sinon.stub(client.config.agent, "http").rejects(new Error("timeout!"));

    usa(client, id, { query })
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

    usa(client, id, { query })
      .then(() => done(new Error("Promise should be rejected")))
      .catch((error) => {
        assert.instanceOf(error, IdpcBalanceDepletedError);
        assert.isTrue(error instanceof IdpcRequestFailedError);
        done();
      });
  });
});

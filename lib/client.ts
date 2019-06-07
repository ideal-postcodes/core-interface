import { Agent, HttpResponse, Header, StringMap } from "./agent";
import {
  Authenticable,
  Filterable,
  Taggable,
  HttpOptions,
  Paginateable,
} from "./types";
import {
  IdpcPostcodeNotFoundError,
  IdpcUmprnNotFoundError,
  IdpcUdprnNotFoundError,
} from "./error";
import * as errors from "./error";
import { Address, KeyStatus } from "@ideal-postcodes/api-typings";
import {
  appendAuthorization,
  appendPage,
  appendIp,
  appendFilter,
  appendTags,
} from "./util";
import { Request as BaseRequest } from "./resources/resource";

interface Request extends BaseRequest {
  query: StringMap;
  header: StringMap;
}

type Protocol = "http" | "https";

export interface Config {
  /**
   * Use TLS. Defaults to `true`
   */
  tls: boolean;
  /**
   * API Key. Used in API helper methods
   */
  api_key: string;
  /**
   * Target API hostname. Defaults to `'api.ideal-postcodes.co.uk'`
   */
  baseUrl: string;
  /**
   * API version. Defaults to `'v1'`
   */
  version: string;
  /**
   * Force autocomplete authorisation via HTTP headers only. Defaults to `false`
   */
  strictAuthorisation: boolean;
  /**
   * Time before HTTP request timeout. Defaults to 10s
   */
  timeout: number;
  /**
   * HTTP Agent
   *
   * For downstream clients like core-node and core-browser, this will default to the native platform HTTP client
   */
  agent: Agent;
  /**
   * String map specifying default headers
   */
  header: Header;
}

interface Defaults {
  header: Header;
}

import {
  create as createAddressResource,
  AddressResource,
} from "./resources/addresses";

import {
  create as createPostcodeResource,
  PostcodeResource,
} from "./resources/postcodes";

import { create as createKeyResource, KeyResource } from "./resources/keys";

import {
  create as createUdprnResource,
  UdprnResource,
} from "./resources/udprn";

import {
  create as createUmprnResource,
  UmprnResource,
} from "./resources/umprn";

interface LookupIdOptions
  extends Authenticable,
    Filterable,
    Taggable,
    HttpOptions {}

interface LookupAddressOptions
  extends Authenticable,
    Filterable,
    Taggable,
    Paginateable,
    HttpOptions {
  /**
   * Query for address
   */
  query: string;
}

interface LookupPostcodeOptions extends LookupIdOptions {
  /**
   * Postcode to query for. Space and case insensitive
   */
  postcode: string;
  /**
   * With multiple residence datasets, a very small number of postcodes will
   * yield more than 100 results. In this instance, you would need to paginate
   * through them with `page`
   */
  page?: number;
}

interface LookupUdprnOptions extends LookupIdOptions {
  /**
   * UDPRN to query for
   */
  udprn: number;
}

interface LookupUmprnOptions extends LookupIdOptions {
  /**
   * UMPRN to query for
   */
  umprn: number;
}

interface CheckKeyUsabilityOptions extends HttpOptions {
  /**
   * If api_key is supplied, this will overwrite the key defined during client instantiation
   */
  api_key?: string;
}

export class Client {
  static defaults: Defaults = {
    header: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  readonly tls: boolean;
  readonly api_key: string;
  readonly baseUrl: string;
  readonly version: string;
  readonly strictAuthorisation: boolean;
  readonly timeout: number;
  readonly agent: Agent;
  readonly header: Header;
  readonly postcodes: PostcodeResource;
  readonly addresses: AddressResource;
  readonly udprn: UdprnResource;
  readonly umprn: UmprnResource;
  readonly keys: KeyResource;

  static errors = errors;

  constructor(config: Config) {
    this.tls = config.tls;
    this.api_key = config.api_key;
    this.baseUrl = config.baseUrl;
    this.version = config.version;
    this.strictAuthorisation = config.strictAuthorisation;
    this.timeout = config.timeout;
    this.agent = config.agent;
    this.header = { ...Client.defaults.header, ...config.header };
    this.postcodes = createPostcodeResource(this);
    this.addresses = createAddressResource(this);
    this.udprn = createUdprnResource(this);
    this.umprn = createUmprnResource(this);
    this.keys = createKeyResource(this);
  }

  /**
   * url
   *
   * Return base URL for API requests
   */
  url(): string {
    return `${this.protocol()}://${this.baseUrl}/${this.version}`;
  }

  protocol(): Protocol {
    return this.tls ? "https" : "http";
  }

  /**
   * ping
   *
   * Dispatches HTTP request to root endpoint "`/`"
   */
  ping(): Promise<HttpResponse> {
    const method = "GET";
    const url = `${this.protocol()}://${this.baseUrl}/`;
    return this.agent.http({
      method,
      url,
      header: {},
      query: {},
      timeout: this.timeout,
    });
  }

  /**
   * lookupPostcode
   *
   * Search for addresses given a postcode. Postcode queries are case and space insensitive
   *
   * Invalid postcodes return an empty array address result `[]`
   *
   * [API Documentation for /postcodes](https://ideal-postcodes.co.uk/documentation/postcodes#postcode)
   */
  lookupPostcode(options: LookupPostcodeOptions): Promise<Address[]> {
    const queryOptions = this.toAddressIdQuery(options);

    const { page } = options;
    if (page !== undefined) queryOptions.query.page = page.toString();

    return this.postcodes
      .retrieve(options.postcode, queryOptions)
      .then(response => response.body.result)
      .catch(error => {
        if (error instanceof IdpcPostcodeNotFoundError) return [];
        throw error;
      });
  }

  /**
   * lookupAddress
   *
   * Search for an address given a query
   *
   * [API Documentation for /addresses](https://ideal-postcodes.co.uk/documentation/addresses#query)
   */
  lookupAddress(options: LookupAddressOptions): Promise<Address[]> {
    const header: StringMap = {};
    const query: StringMap = { query: options.query };

    appendAuthorization({ client: this, header, options });
    appendIp({ header, options });
    appendFilter({ query, options });
    appendTags({ query, options });
    appendPage({ query, options });

    const queryOptions: Request = { header, query };
    if (options.timeout !== undefined) queryOptions.timeout = options.timeout;

    return this.addresses
      .list(queryOptions)
      .then(response => response.body.result.hits);
  }

  /**
   * toAddressIdQuery
   *
   * Generates a request object. Bundles together commonly used header/query extractions:
   * - Authorization (api_key, licensee, user_token)
   * - Source IP forwarding
   * - Result filtering
   * - Tagging
   */
  private toAddressIdQuery(options: LookupIdOptions): Request {
    const header: StringMap = {};
    const query: StringMap = {};

    appendAuthorization({ client: this, header, options });
    appendIp({ header, options });
    appendFilter({ query, options });
    appendTags({ query, options });

    const request: Request = { header, query };
    if (options.timeout !== undefined) request.timeout = options.timeout;

    return request;
  }

  /**
   * lookupUdprn
   *
   * Search for an address given a UDPRN
   *
   * Invalid UDPRN returns `null`
   *
   * [API Documentation for /udprn](https://ideal-postcodes.co.uk/documentation/udprn)
   */
  lookupUdprn(options: LookupUdprnOptions): Promise<Address | null> {
    const queryOptions = this.toAddressIdQuery(options);
    return this.udprn
      .retrieve(options.udprn.toString(), queryOptions)
      .then(response => response.body.result)
      .catch(error => {
        if (error instanceof IdpcUdprnNotFoundError) return null;
        throw error;
      });
  }

  /**
   * lookupUdprn
   *
   * Search for an address given a UDPRN
   *
   * Invalid UDPRN returns `null`
   *
   * [API Documentation for /udprn](https://ideal-postcodes.co.uk/documentation/udprn)
   */
  lookupUmprn(options: LookupUmprnOptions): Promise<Address | null> {
    const queryOptions = this.toAddressIdQuery(options);
    return this.umprn
      .retrieve(options.umprn.toString(), queryOptions)
      .then(response => response.body.result)
      .catch(error => {
        if (error instanceof IdpcUmprnNotFoundError) return null;
        throw error;
      });
  }

  checkKeyUsability(options: CheckKeyUsabilityOptions): Promise<KeyStatus> {
    const { api_key = this.api_key, timeout } = options;
    const queryOptions: Request = { query: {}, header: {} };
    if (timeout !== undefined) queryOptions.timeout = timeout;
    return this.keys
      .retrieve(api_key, queryOptions)
      .then(response => response.body.result as KeyStatus); // Assert that we're retrieving public key information as no user_token provided
  }
}

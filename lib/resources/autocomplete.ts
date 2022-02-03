import { listMethod, retrieveMethod } from "./resource";
import { AddressSuggestionResponse, GbrResolveResponse } from "../types";
import { OptionalStringMap } from "../util";
import { Client } from "../client";
import { HttpResponse } from "../agent";

export interface Query extends OptionalStringMap {
  // Authentication
  api_key?: string;
  licensee?: string;

  // Result Filtering
  filter?: string;

  // Query options
  page?: string;
  limit?: string;

  // Misc
  tags?: string;

  // Filters
  postcode?: string;
  postcode_outward?: string;
  post_town?: string;
  dependant_locality?: string;
  organisation_name?: string;
  thoroughfare?: string;
  dependant_thoroughfare?: string;
  building_name?: string;
  building_number?: string;
  sub_building_name?: string;
  district?: string;
  ward?: string;
  postcode_type?: string;
  su_organisation_indicator?: string;
  country?: string;
  box?: string;
}

interface Header extends OptionalStringMap {
  Authorization?: string;
}

export interface Request {
  query?: Query;
  header?: Header;
  timeout?: number;
}

export interface Response extends HttpResponse {
  body: AddressSuggestionResponse;
}

export interface AutocompleteResource {
  list(request: Request): Promise<Response>;
}

const resource = "autocomplete/addresses";

export interface List {
  (client: Client, request: Request): Promise<Response>;
}

export const list: List = (client, request) =>
  listMethod<Request, AddressSuggestionResponse>({ resource, client })(request);

export interface GbrResponse extends HttpResponse {
  body: GbrResolveResponse;
}

export interface Gbr {
  (client: Client, id: string, request: Request): Promise<GbrResponse>;
}

// Resolves address to the GBR format
export const gbr: Gbr = (client, id, request) =>
  retrieveMethod<Request, GbrResolveResponse>({
    resource,
    client,
    action: "gbr",
  })(id, request);

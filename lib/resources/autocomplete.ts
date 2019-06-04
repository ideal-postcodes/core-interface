import { listMethod } from "./resource";
import { AddressSuggestionResponse } from "../../node_modules/@ideal-postcodes/api-typings";
import { OptionalStringMap } from "../util";
import { Client } from "../client";
import { HttpResponse } from "../agent";

interface Query extends OptionalStringMap {
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

interface Request {
  query?: Query;
  header?: Header;
  timeout?: number;
}

interface Response extends HttpResponse {
  body: AddressSuggestionResponse;
}

export interface AutocompleteResource {
  list(request: Request): Promise<Response>;
}

const resource = "autocomplete/addresses";

export const create = (client: Client): AutocompleteResource => {
  const list = listMethod<Request, AddressSuggestionResponse>({
    resource,
    client,
  });
  return { list };
};

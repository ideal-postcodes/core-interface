import { listMethod } from "./resource";
import { AddressSuggestionResponse } from "../../node_modules/@ideal-postcodes/api-typings";
import { OptionalStringMap } from "../util";
import { Client } from "../client";
import { HttpResponse } from "../agent";

interface Query extends OptionalStringMap {
  api_key?: string;
  licensee?: string;
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

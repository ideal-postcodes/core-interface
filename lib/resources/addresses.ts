import {
  AddressQueryResponse,
  AddressSuggestionResponse,
} from "@ideal-postcodes/api-typings";
import { toStringMap, OptionalStringMap, toTimeout, toHeader } from "../util";
import { parse } from "../error";
import { Client } from "../client";
import { HttpResponse } from "../agent";

interface Query extends OptionalStringMap {
  api_key?: string;
  licensee?: string;
  filter?: string;
  page?: string;
}

interface Header extends OptionalStringMap {
  Authorization?: string;
}

interface Request {
  query?: Query;
  header?: Header;
  timeout?: number;
}

export interface AddressResource {
  list(request: Request): Promise<AddressesResponse>;
  autocomplete(request: Request): Promise<AutocompleteResponse>;
}

interface AddressesResponse extends HttpResponse {
  body: AddressQueryResponse;
}

interface AutocompleteResponse extends HttpResponse {
  body: AddressSuggestionResponse;
}

export const create = (client: Client): AddressResource => {
  return {
    list: request => {
      return client.agent
        .http({
          method: "GET",
          url: `${client.url}/addresses`,
          query: toStringMap(request.query),
          header: toHeader(request, client),
          timeout: toTimeout(request, client),
        })
        .then((response: AddressesResponse) => {
          const error = parse(response);
          if (error) return Promise.reject(error);
          return Promise.resolve(response);
        });
    },

    autocomplete: request => {
      return client.agent
        .http({
          method: "GET",
          url: `${client.url}/autocomplete/addresses`,
          query: toStringMap(request.query),
          header: toHeader(request, client),
          timeout: toTimeout(request, client),
        })
        .then((response: AutocompleteResponse) => {
          const error = parse(response);
          if (error) return Promise.reject(error);
          return Promise.resolve(response);
        });
    },
  };
};

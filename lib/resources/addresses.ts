import { AddressQueryResponse } from "@ideal-postcodes/api-typings";
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

interface ListRequest {
  query?: Query;
  header?: Header;
  timeout?: number;
}

export interface AddressResource {
  list(request: ListRequest): Promise<Response>;
}

interface Response extends HttpResponse {
  body: AddressQueryResponse;
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
        .then((response: Response) => {
          const error = parse(response);
          if (error) return Promise.reject(error);
          return Promise.resolve(response);
        });
    },
  };
};

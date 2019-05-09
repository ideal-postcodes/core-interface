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

interface GetRequest {
  query?: Query;
  header?: Header;
  timeout?: number;
  postcode: string;
}

export interface PostcodeResource {
  get(request: GetRequest): Promise<HttpResponse>;
}

export const create = (client: Client): PostcodeResource => {
  return {
    get: request => {
      return client.agent
        .http({
          method: "GET",
          url: `${client.url}/postcodes/${request.postcode}`,
          query: toStringMap(request.query),
          header: toHeader(request, client),
          timeout: toTimeout(request, client),
        })
        .then(response => {
          const error = parse(response);
          if (error) return Promise.reject(error);
          return Promise.resolve(response);
        });
    },
  };
};

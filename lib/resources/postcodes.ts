import { PostcodesResponse } from "../../node_modules/@ideal-postcodes/api-typings";
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

interface RetrieveRequest {
  query?: Query;
  header?: Header;
  timeout?: number;
  postcode: string;
}

export interface PostcodeResource {
  retrieve(request: RetrieveRequest): Promise<Response>;
}

interface Response extends HttpResponse {
  body: PostcodesResponse;
}

export const create = (client: Client): PostcodeResource => {
  return {
    retrieve: request => {
      return client.agent
        .http({
          method: "GET",
          url: `${client.url}/postcodes/${request.postcode}`,
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

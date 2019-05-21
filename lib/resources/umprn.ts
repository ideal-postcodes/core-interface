import { UmprnResponse } from "../../node_modules/@ideal-postcodes/api-typings";
import { toStringMap, OptionalStringMap, toTimeout, toHeader } from "../util";
import { parse } from "../error";
import { Client } from "../client";
import { HttpResponse } from "../agent";

interface Query extends OptionalStringMap {
  api_key?: string;
  licensee?: string;
  filter?: string;
}

interface Header extends OptionalStringMap {
  Authorization?: string;
}

interface Request {
  query?: Query;
  header?: Header;
  timeout?: number;
  umprn: string | number;
}

export interface UmprnResource {
  retrieve(request: Request): Promise<Response>;
}

interface Response extends HttpResponse {
  body: UmprnResponse;
}

export const create = (client: Client): UmprnResource => {
  return {
    retrieve: request => {
      return client.agent
        .http({
          method: "GET",
          url: `${client.url}/umprn/${request.umprn}`,
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

import { UdprnResponse } from "../../node_modules/@ideal-postcodes/api-typings";
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
  udprn: string | number;
}

export interface UdprnResource {
  retrieve(request: Request): Promise<Response>;
}

interface Response extends HttpResponse {
  body: UdprnResponse;
}

export const create = (client: Client): UdprnResource => {
  return {
    retrieve: request => {
      return client.agent
        .http({
          method: "GET",
          url: `${client.url}/udprn/${request.udprn}`,
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

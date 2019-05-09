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
      const { postcode } = request;
      const method = "GET";
      const timeout = toTimeout(request, client);
      const header = toHeader(request, client);
      const query = toStringMap(request.query);
      const url = `${client.url}/postcodes/${postcode}`;

      return new Promise((resolve, reject) => {
        client.agent.http(
          { method, url, query, header, timeout },
          (connError, response) => {
            if (connError) return reject(connError);
            const error = parse(response);
            if (error) return reject(error);
            resolve(response);
          }
        );
      });
    },
  };
};

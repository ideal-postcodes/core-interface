import { OptionalStringMap, toStringMap, toTimeout, toHeader } from "../util";
import { parse } from "../error";
import { Client } from "../client";
import { HttpResponse } from "../agent";

interface RetrieveOptions {
  // Name of resource, e.g. "postcodes"
  resource: string;
  client: Client;
}

export interface Request {
  query?: OptionalStringMap;
  header?: OptionalStringMap;
  timeout?: number;
}

interface Response<U> extends HttpResponse {
  body: U;
}

export const retrieveMethod = <T extends Request, U>({
  client,
  resource,
}: RetrieveOptions) => {
  return (id: string, request: T) => {
    return client.agent
      .http({
        method: "GET",
        url: `${client.url}/${resource}/${id}`,
        query: toStringMap(request.query),
        header: toHeader(request, client),
        timeout: toTimeout(request, client),
      })
      .then((response: Response<U>) => {
        const error = parse(response);
        if (error) return Promise.reject(error);
        return Promise.resolve(response);
      });
  };
};

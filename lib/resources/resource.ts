import { OptionalStringMap, toStringMap, toTimeout, toHeader } from "../util";
import { parse } from "../error";
import { Client } from "../client";
import { HttpResponse } from "../agent";

interface Options {
  // Name of resource, e.g. "postcodes"
  resource: string;
  // Resource action, e.g. "usage" maps to `/resource/:id/usage"
  action?: string;
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

// Writes a resource to URL string
const toRetrieveUrl = (options: Options, id: string): string => {
  return [
    options.client.url(),
    options.resource,
    encodeURIComponent(id),
    options.action,
  ]
    .filter(e => e !== undefined)
    .join("/");
};

export const retrieveMethod = <T extends Request, U>(options: Options) => {
  const { client } = options;
  return (id: string, request: T) => {
    return client.agent
      .http({
        method: "GET",
        url: toRetrieveUrl(options, id),
        query: toStringMap(request.query),
        header: toHeader(request, client),
        timeout: toTimeout(request, client),
      })
      .then((response: Response<U>) => {
        const error = parse(response);
        if (error) throw error;
        return response;
      });
  };
};

export const listMethod = <T extends Request, U>(options: Options) => {
  const { client, resource } = options;
  return (request: T) => {
    return client.agent
      .http({
        method: "GET",
        url: `${client.url()}/${resource}`,
        query: toStringMap(request.query),
        header: toHeader(request, client),
        timeout: toTimeout(request, client),
      })
      .then((response: Response<U>) => {
        const error = parse(response);
        if (error) throw error;
        return response;
      });
  };
};

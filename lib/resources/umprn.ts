import { retrieveMethod } from "./resource";
import { UmprnResponse } from "../../node_modules/@ideal-postcodes/api-typings";
import { OptionalStringMap } from "../util";
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
}

interface Response extends HttpResponse {
  body: UmprnResponse;
}

export interface UmprnResource {
  retrieve(umprn: string, request: Request): Promise<Response>;
}

const resource = "umprn";

export const create = (client: Client): UmprnResource => {
  const retrieve = retrieveMethod<Request, UmprnResponse>({ resource, client });
  return { retrieve };
};

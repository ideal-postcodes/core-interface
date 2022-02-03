import { retrieveMethod } from "./resource";
import { UmprnResponse } from "../types";
import { OptionalStringMap } from "../util";
import { Client } from "../client";
import { HttpResponse } from "../agent";

export interface Query extends OptionalStringMap {
  // Authentication
  api_key?: string;
  licensee?: string;

  // Result Filtering
  filter?: string;

  // Misc
  tags?: string;
}

export interface Header extends OptionalStringMap {
  Authorization?: string;
  "IDPC-Source-IP"?: string;
}

export interface Request {
  query?: Query;
  header?: Header;
  timeout?: number;
}

export interface Response extends HttpResponse {
  body: UmprnResponse;
}

const resource = "umprn";

export interface Retrieve {
  (client: Client, umprn: string, request: Request): Promise<Response>;
}

export const retrieve: Retrieve = (client, umprn, request) =>
  retrieveMethod<Request, UmprnResponse>({ resource, client })(umprn, request);

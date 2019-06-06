import { retrieveMethod } from "./resource";
import { UmprnResponse } from "@ideal-postcodes/api-typings";
import { OptionalStringMap } from "../util";
import { Client } from "../client";
import { HttpResponse } from "../agent";

interface Query extends OptionalStringMap {
  // Authentication
  api_key?: string;
  licensee?: string;

  // Result Filtering
  filter?: string;

  // Misc
  tags?: string;
}

interface Header extends OptionalStringMap {
  Authorization?: string;
  "IDPC-Source-IP"?: string;
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

import { retrieveMethod } from "./resource";
import { UdprnResponse } from "../../node_modules/@ideal-postcodes/api-typings";
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
  body: UdprnResponse;
}

export interface UdprnResource {
  retrieve(udprn: string, request: Request): Promise<Response>;
}

const resource = "udprn";

export const create = (client: Client): UdprnResource => {
  const retrieve = retrieveMethod<Request, UdprnResponse>({ resource, client });
  return { retrieve };
};

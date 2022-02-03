import { retrieveMethod } from "./resource";
import { UdprnResponse } from "../types";
import { OptionalStringMap } from "../util";
import { Client } from "../client";
import { HttpResponse } from "../agent";

export interface Query extends OptionalStringMap {
  api_key?: string;
  licensee?: string;
  filter?: string;
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
  body: UdprnResponse;
}

const resource = "udprn";

export interface Retrieve {
  (client: Client, udprn: string, request: Request): Promise<Response>;
}

export const retrieve: Retrieve = (
  client: Client,
  udprn: string,
  request: Request
) =>
  retrieveMethod<Request, UdprnResponse>({ resource, client })(udprn, request);

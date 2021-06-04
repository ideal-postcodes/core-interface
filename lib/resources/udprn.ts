import { retrieveMethod } from "./resource";
import { UdprnResponse } from "@ideal-postcodes/api-typings";
import { OptionalStringMap } from "../util";
import { Client } from "../client";
import { HttpResponse } from "../agent";

interface Query extends OptionalStringMap {
  api_key?: string;
  licensee?: string;
  filter?: string;
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

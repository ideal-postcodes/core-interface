import { retrieveMethod } from "./resource";
import { PostcodesResponse } from "@ideal-postcodes/api-typings";
import { OptionalStringMap } from "../util";
import { Client } from "../client";
import { HttpResponse } from "../agent";

interface Query extends OptionalStringMap {
  api_key?: string;
  licensee?: string;
  filter?: string;
  page?: string;
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
  body: PostcodesResponse;
}

export interface PostcodeResource {
  retrieve(postcode: string, request: Request): Promise<Response>;
}

const resource = "postcodes";

export interface Retrieve {
  (client: Client, postcode: string, request: Request): Promise<Response>;
}

export const retrieve: Retrieve = (client, postcode, request) =>
  retrieveMethod<Request, PostcodesResponse>({
    resource,
    client,
  })(postcode, request);

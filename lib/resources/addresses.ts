import { listMethod } from "./resource";
import { AddressQueryResponse } from "../../node_modules/@ideal-postcodes/api-typings";
import { OptionalStringMap } from "../util";
import { Client } from "../client";
import { HttpResponse } from "../agent";

/**
 * Query
 */
interface Query extends OptionalStringMap {
  api_key?: string;
  licensee?: string;
  filter?: string;
  page?: string;
  limit?: string;
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
  body: AddressQueryResponse;
}

export interface AddressResource {
  list(request: Request): Promise<Response>;
}

const resource = "addresses";

export const create = (client: Client): AddressResource => {
  const list = listMethod<Request, AddressQueryResponse>({ resource, client });
  return { list };
};

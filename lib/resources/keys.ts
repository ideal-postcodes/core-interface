import { retrieveMethod } from "./resource";
import {
  PublicKeyResponse,
  PrivateKeyResponse,
} from "../../node_modules/@ideal-postcodes/api-typings";
import { OptionalStringMap } from "../util";
import { Client } from "../client";
import { HttpResponse } from "../agent";

interface RetrieveQuery extends OptionalStringMap {
  user_token?: string;
}

interface Header extends OptionalStringMap {
  Authorization?: string;
}

interface Request {
  query?: RetrieveQuery;
  header?: Header;
  timeout?: number;
}

type KeyResponse = PublicKeyResponse | PrivateKeyResponse;

interface Response extends HttpResponse {
  body: KeyResponse;
}

export interface KeyResource {
  retrieve(postcode: string, request: Request): Promise<Response>;
}

const resource = "keys";

export const create = (client: Client): KeyResource => {
  const retrieve = retrieveMethod<Request, KeyResponse>({
    resource,
    client,
  });
  return { retrieve };
};

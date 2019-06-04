import { retrieveMethod } from "./resource";
import {
  PublicKeyResponse,
  PrivateKeyResponse,
  KeyUsageResponse,
} from "../../node_modules/@ideal-postcodes/api-typings";
import { OptionalStringMap } from "../util";
import { Client } from "../client";
import { HttpResponse } from "../agent";

interface RetrieveQuery extends OptionalStringMap {
  user_token?: string;
}

interface RetrieveUsageQuery extends RetrieveQuery {
  start?: string;
  end?: string;
  tags?: string;
  licensee?: string;
}

interface Header extends OptionalStringMap {
  Authorization?: string;
}

interface Request {
  query?: RetrieveQuery;
  header?: Header;
  timeout?: number;
}

interface UsageRequest extends Request {
  query?: RetrieveUsageQuery;
}

type KeyResponse = PublicKeyResponse | PrivateKeyResponse;

interface Response extends HttpResponse {
  body: KeyResponse;
}

interface UsageResponse extends HttpResponse {
  body: KeyUsageResponse;
}

export interface KeyResource {
  retrieve(key: string, request: Request): Promise<Response>;
  usage(postcode: string, request: UsageRequest): Promise<UsageResponse>;
}

const resource = "keys";

export const create = (client: Client): KeyResource => {
  const retrieve = retrieveMethod<Request, KeyResponse>({
    resource,
    client,
  });

  const usage = retrieveMethod<UsageRequest, KeyUsageResponse>({
    resource,
    client,
    action: "usage",
  });

  return { retrieve, usage };
};

import { retrieveMethod } from "./resource";
import {
  PublicKeyResponse,
  PrivateKeyResponse,
  KeyUsageResponse,
} from "@ideal-postcodes/api-typings";
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

const resource = "keys";

export interface Retrieve {
  (client: Client, apiKey: string, request: Request): Promise<Response>;
}

export const retrieve: Retrieve = (client, apiKey, request) =>
  retrieveMethod<Request, KeyResponse>({
    resource,
    client,
  })(apiKey, request);

export interface Usage {
  (
    client: Client,
    apiKey: string,
    request: UsageRequest
  ): Promise<UsageResponse>;
}

export const usage: Usage = (client, apiKey, request) =>
  retrieveMethod<UsageRequest, KeyUsageResponse>({
    resource,
    client,
    action: "usage",
  })(apiKey, request);

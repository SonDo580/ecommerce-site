import { Request } from "express";

import { IApiKey } from "@root/models/api-key.model";
import { IKeyToken } from "@root/models/key-token.model";
import { AuthTokenPayload } from "./payloads/auth-token.payload";

export interface CustomRequest extends Request {
  apiKey?: IApiKey;
  keyToken?: IKeyToken;
  shop?: AuthTokenPayload;
}

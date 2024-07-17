import { Request } from "express";

import { IApiKey } from "@root/models/api-key.model";
import { IKeyToken } from "@root/models/key-token.model";

export interface CustomRequest extends Request {
  apiKey?: IApiKey;
  keyToken?: IKeyToken;
}

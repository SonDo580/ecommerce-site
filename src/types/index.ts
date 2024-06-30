import { IApiKey } from "@root/models/api-key.model";
import { Request } from "express";

interface CustomRequest extends Request {
  apiKey?: IApiKey;
}

export { CustomRequest };

import { NextFunction, Response } from "express";
import { ApiKeyService } from "@root/services/api-key.service";
import { CustomRequest } from "@root/types";

const HEADERS = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const checkApiKey = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = req.headers[HEADERS.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    const keyObj = await ApiKeyService.findKey(key);
    if (!keyObj) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    req.apiKey = keyObj;
    next();
  } catch (err) {
    next(err);
  }
};

const checkPermission =
  (permission: string) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const permissions = req.apiKey?.permissions;
    if (!permissions) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    next();
  };

export { checkApiKey, checkPermission };

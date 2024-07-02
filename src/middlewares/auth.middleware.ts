import { NextFunction, Response } from "express";

import { ApiKeyService } from "@root/services/api-key.service";
import { CustomRequest } from "@root/types";
import { ForbiddenError, UnauthorizedError } from "@root/core/error.response";
import { asyncHandler } from "./error-handler.middleware";

const HEADERS = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const checkApiKey = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const key = req.headers[HEADERS.API_KEY]?.toString();
    if (!key) {
      throw new UnauthorizedError();
    }

    const keyObj = await ApiKeyService.findKey(key);
    if (!keyObj) {
      throw new UnauthorizedError();
    }

    req.apiKey = keyObj;
    next();
  }
);

const checkPermission = (permission: string) =>
  asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      const permissions = req.apiKey?.permissions;
      if (!permissions || !permissions.includes(permission)) {
        throw new ForbiddenError();
      }
      next();
    }
  );

export { checkApiKey, checkPermission };

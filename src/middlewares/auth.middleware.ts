import { NextFunction, Response } from "express";

import { ApiKeyService } from "@root/services/api-key.service";
import { CustomRequest } from "@root/types";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@root/core/error.response";
import { asyncHandler } from "./error-handler.middleware";
import { KeyTokenService } from "@root/services/key-token.service";
import { ErrorMessage } from "@root/constants/message.const";
import { AuthUtil } from "@root/utils/auth.util";

const HEADERS = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
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

const checkAuthentication = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const clientId = req.headers[HEADERS.CLIENT_ID];
    if (!clientId) {
      throw new UnauthorizedError();
    }

    const keyToken = await KeyTokenService.findByShopId(clientId as string);
    if (!keyToken) {
      throw new NotFoundError(ErrorMessage.KEY_NOT_FOUND);
    }

    const accessToken = req.headers[HEADERS.AUTHORIZATION] as string
    if (!accessToken) {
      throw new UnauthorizedError();
    }

    const decoded = await AuthUtil.verifyToken(
      accessToken as string,
      keyToken.publicKey,
      UnauthorizedError
    );

    if (decoded.shopId !== clientId) {
      throw new UnauthorizedError();
    }

    req.keyToken = keyToken;
    next();
  }
);

export { checkApiKey, checkPermission, checkAuthentication };

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
import { Headers } from "@root/constants";

export const checkApiKey = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const key = req.headers[Headers.API_KEY]?.toString();
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

export const checkPermission = (permission: string) =>
  asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      const permissions = req.apiKey?.permissions;
      if (!permissions || !permissions.includes(permission)) {
        throw new ForbiddenError();
      }
      next();
    }
  );

export const checkAuthentication = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const clientId = req.headers[Headers.CLIENT_ID] as string;
    if (!clientId) {
      throw new UnauthorizedError();
    }

    const refreshToken = req.headers[Headers.REFRESH_TOKEN] as string;
    if (!refreshToken) {
      throw new UnauthorizedError();
    }

    const keyToken = await KeyTokenService.findByShopId(clientId);
    if (!keyToken) {
      throw new NotFoundError(ErrorMessage.SHOP_NOT_REGISTERED);
    }

    // keyToken2 can be the same keyToken
    const keyToken2 = await KeyTokenService.findInUsedRefreshTokens(
      refreshToken
    );
    if (keyToken2) {
      await KeyTokenService.deleteByShopId(keyToken2.shop.toString());
      throw new ForbiddenError(ErrorMessage.NEED_LOGIN_AGAIN);
    }

    const accessToken = req.headers[Headers.AUTHORIZATION] as string;
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

import { NextFunction, Response } from "express";

import { ApiKeyService } from "@root/services/api-key.service";
import { CustomRequest } from "@root/interfaces/custom-request.interface";
import { ForbiddenError, UnauthorizedError } from "@root/core/error.response";
import { asyncHandler } from "./error-handler.middleware";
import { KeyTokenService } from "@root/services/key-token.service";
import { ErrorMessage } from "@root/constants/message.const";
import { AuthUtil } from "@root/utils/auth.util";
import { Headers } from "@root/constants";
import { AuthTokenPayload } from "@root/interfaces/payloads/auth-token.payload";

export const checkApiKey = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const apiKey = req.headers[Headers.API_KEY] as string;
    if (!apiKey) {
      throw new UnauthorizedError();
    }

    const apiKeyObj = await ApiKeyService.findKey(apiKey);
    if (!apiKeyObj) {
      throw new UnauthorizedError();
    }

    req.apiKey = apiKeyObj;
    next();
  }
);

export const checkPermission = (permission: string) =>
  asyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      const permissions = req.apiKey!.permissions;
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
      throw new UnauthorizedError(ErrorMessage.KEY_NOT_FOUND);
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

    const decoded = (await AuthUtil.verifyToken(
      accessToken as string,
      keyToken.publicKey,
      UnauthorizedError
    )) as AuthTokenPayload;

    if (decoded.shopId !== clientId) {
      throw new UnauthorizedError();
    }

    req.keyToken = keyToken;
    next();
  }
);

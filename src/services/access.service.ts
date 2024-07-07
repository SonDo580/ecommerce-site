import bcrypt from "bcrypt";

import { Role } from "@root/constants";
import { AuthUtil } from "@root/utils/auth.util";
import { TransformUtil } from "@root/utils/transform.util";
import { KeyTokenService } from "./key-token.service";
import { ErrorMessage } from "@root/constants/message.const";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
} from "@root/core/error.response";
import { SignUpPayload } from "@root/interfaces/requests/sign-up.request";
import { ShopService } from "./shop.service";
import { SignUpResult } from "@root/interfaces/responses/sign-up.response";

export class AccessService {
  static async signUp({
    name,
    email,
    password,
  }: SignUpPayload): Promise<SignUpResult> {
    const existedShop = await ShopService.findByEmail(email);
    if (existedShop) {
      throw new ConflictError(ErrorMessage.EMAIL_REGISTERED);
    }

    const newShop = await ShopService.create({
      name,
      email,
      password,
      roles: [Role.SHOP],
    });

    const { privateKey, publicKey } = await AuthUtil.createAsymmetricKeyPair();

    const tokens = await AuthUtil.createTokenPair(
      {
        shopId: newShop._id,
        email,
      },
      privateKey
    );

    await KeyTokenService.upsertKeyToken(
      newShop._id.toString(),
      publicKey,
      tokens.refreshToken
    );

    return {
      shop: TransformUtil.extractFields(newShop.toObject(), [
        "_id",
        "name",
        "email",
      ]),
      tokens,
    };
  }

  static async login({ email, password }: any) {
    const shop = await ShopService.findByEmail(email);
    if (!shop) {
      throw new BadRequestError(ErrorMessage.SHOP_NOT_FOUND);
    }

    const passwordMatch = await bcrypt.compare(password, shop.password);
    if (!passwordMatch) {
      throw new UnauthorizedError(ErrorMessage.AUTHENTICATION_FAILED);
    }

    const { privateKey, publicKey } = await AuthUtil.createAsymmetricKeyPair();

    const tokens = await AuthUtil.createTokenPair(
      {
        shopId: shop._id,
        email,
      },
      privateKey
    );

    await KeyTokenService.upsertKeyToken(
      shop._id.toString(),
      publicKey,
      tokens.refreshToken
    );

    return {
      shop: TransformUtil.extractFields(shop, ["_id", "name", "email"]),
      tokens,
    };
  }

  static async logout(keyToken: any) {
    return await KeyTokenService.deleteById(keyToken._id);
  }

  static async handleRefreshToken(refreshToken: string) {
    const keyToken = await KeyTokenService.findInUsedRefreshTokens(
      refreshToken
    );

    if (keyToken) {
      const { shopId } = await AuthUtil.verifyToken(
        refreshToken,
        keyToken.publicKey
      );

      await KeyTokenService.deleteByShopId(shopId);
      throw new ForbiddenError(ErrorMessage.NEED_LOGIN_AGAIN);
    }

    const ownKeyToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!ownKeyToken) {
      throw new UnauthorizedError(ErrorMessage.SHOP_NOT_REGISTERED);
    }

    const { email } = await AuthUtil.verifyToken(
      refreshToken,
      ownKeyToken.publicKey
    );

    const shop = await ShopService.findByEmail(email);
    if (!shop) {
      throw new UnauthorizedError(ErrorMessage.SHOP_NOT_REGISTERED);
    }

    const { privateKey, publicKey } = await AuthUtil.createAsymmetricKeyPair();

    const tokens = await AuthUtil.createTokenPair(
      {
        shopId: shop._id,
        email,
      },
      privateKey
    );

    await KeyTokenService.upsertKeyToken(
      shop._id.toString(),
      publicKey,
      tokens.refreshToken
    );

    return {
      shop: TransformUtil.extractFields(shop, ["_id", "name", "email"]),
      tokens,
    };
  }
}

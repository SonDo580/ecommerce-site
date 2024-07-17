import bcrypt from "bcrypt";

import { Role } from "@root/constants";
import { AuthUtil } from "@root/utils/auth.util";
import { TransformUtil } from "@root/utils/transform.util";
import { KeyTokenService } from "./key-token.service";
import { ErrorMessage } from "@root/constants/message.const";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@root/core/error.response";
import { SignUpRequest } from "@root/interfaces/requests/sign-up.request";
import { ShopService } from "./shop.service";
import { SignUpResponse } from "@root/interfaces/responses/sign-up.response";
import { IKeyToken } from "@root/models/key-token.model";
import { LoginRequest } from "@root/interfaces/requests/login.request";
import { LoginResponse } from "@root/interfaces/responses/login.response";
import { RefreshTokenResponse } from "@root/interfaces/responses/refresh-token.response";

export class AccessService {
  static async signUp({
    name,
    email,
    password,
  }: SignUpRequest): Promise<SignUpResponse> {
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
        shopId: newShop._id.toString(),
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

  static async login({
    email,
    password,
  }: LoginRequest): Promise<LoginResponse> {
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
        shopId: shop._id.toString(),
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

  static async logout(keyToken: IKeyToken) {
    return await KeyTokenService.deleteById(keyToken._id.toString());
  }

  static async handleRefreshToken(
    keyToken: IKeyToken,
    refreshToken: string
  ): Promise<RefreshTokenResponse> {
    const { email } = await AuthUtil.verifyToken(
      refreshToken,
      keyToken.publicKey
    );

    const shop = await ShopService.findByEmail(email);
    if (!shop) {
      throw new NotFoundError(ErrorMessage.SHOP_NOT_REGISTERED);
    }

    const { privateKey, publicKey } = await AuthUtil.createAsymmetricKeyPair();

    const tokens = await AuthUtil.createTokenPair(
      {
        shopId: shop._id.toString(),
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

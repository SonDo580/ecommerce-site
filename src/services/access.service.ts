import crypto from "crypto";

import { ShopModel } from "@root/models/shop.model";
import { Role } from "@root/constants";
import { AuthUtil } from "@root/utils/auth.util";
import { TransformUtil } from "@root/utils/transform.util";
import { KeyTokenService } from "./key-token.service";
import { ErrorMessage } from "@root/constants/message.const";
import { ConflictError } from "@root/core/error.response";
import { SignUpPayload } from "@root/interfaces/requests/sign-up.request";
import { ShopService } from "./shop.service";
import { SignUpResult } from "@root/interfaces/responses/sign-up.response";

export class AccessService {
  static async signUp(payload: SignUpPayload): Promise<SignUpResult> {
    const { name, email, password } = payload;

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

    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    await KeyTokenService.createKeyToken(newShop._id.toString(), publicKey);

    const tokens = await AuthUtil.createTokenPair(
      {
        shopId: newShop._id,
        email,
      },
      privateKey
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
}

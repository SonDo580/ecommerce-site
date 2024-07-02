import bcrypt from "bcrypt";
import crypto from "crypto";

import { ShopModel } from "@root/models/shop.model";
import { Role } from "@root/constants";
import { AuthUtil } from "@root/utils/auth.util";
import { TransformUtil } from "@root/utils/transform.util";
import { KeyTokenService } from "./key-token.service";
import { ErrorMessage } from "@root/constants/message.const";
import { ConflictError } from "@root/core/error.response";

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export class AccessService {
  static async signUp(payload: SignUpPayload) {
    const { name, email, password } = payload;

    const existedShop = await ShopModel.findOne({ email }).lean();
    if (existedShop) {
      throw new ConflictError(ErrorMessage.EMAIL_REGISTERED);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newShop = await ShopModel.create({
      name,
      email,
      password: hashedPassword,
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
      shop: TransformUtil.extractFields(newShop, ["_id", "name", "email"]),
      tokens,
    };
  }
}

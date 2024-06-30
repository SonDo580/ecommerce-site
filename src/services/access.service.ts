import bcrypt from "bcrypt";
import crypto from "crypto";

import { Shop } from "@root/models/shop.model";
import { Role } from "@root/constants";
import { AuthUtil } from "@root/utils/auth.util";
import { TransformUtil } from "@root/utils/transform.util";
import { KeyTokenService } from "./key-token.service";

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export class AccessService {
  static async signUp(payload: SignUpPayload) {
    const { name, email, password } = payload;

    const existedShop = await Shop.findOne({ email }).lean();
    if (existedShop) {
      return {
        code: "xxxx",
        message: "Shop already registered!",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newShop = await Shop.create({
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
      code: 201,
      metadata: {
        shop: TransformUtil.extractFields(newShop, ["_id", "name", "email"]),
        tokens,
      },
    };
  }
}

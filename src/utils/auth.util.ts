import jwt from "jsonwebtoken";
import crypto from "crypto";
import { promisify } from "util";

const generateKeyPairAsync = promisify(crypto.generateKeyPair);

import { GENERAL_CONFIG } from "@root/configs/general.config";

const { ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN } = GENERAL_CONFIG;

export class AuthUtil {
  static async createAsymmetricKeyPair() {
    const { privateKey, publicKey } = await generateKeyPairAsync("rsa", {
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

    return { privateKey, publicKey };
  }

  static async createTokenPair(
    payload: string | object | Buffer,
    privateKey: string
  ) {
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: ACCESS_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }
}

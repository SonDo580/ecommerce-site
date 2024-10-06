import jwt, { Secret } from "jsonwebtoken";
import crypto from "crypto";
import { promisify } from "util";

import { GENERAL_CONFIG } from "@root/configs/general.config";
import { ErrorMessage } from "@root/constants/message.const";
import { BadRequestError } from "@root/core/error.response";
import { AuthTokenPayload } from "@root/interfaces/payloads/auth-token.payload";

const { ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN } = GENERAL_CONFIG;

const generateKeyPairAsync = promisify(crypto.generateKeyPair);
const verifyTokenAsync = promisify<string, Secret>(jwt.verify);

type ErrorConstructor = new (message: string) => Error;

export class AuthUtil {
  static async createAsymmetricKeyPair(): Promise<{
    privateKey: string;
    publicKey: string;
  }> {
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
    payload: AuthTokenPayload,
    privateKey: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
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

  static async verifyToken(
    token: string,
    key: Secret,
    errorConstructor: ErrorConstructor = BadRequestError,
    message: string = ErrorMessage.INVALID_TOKEN
  ): Promise<any> {
    try {
      return await verifyTokenAsync(token, key);
    } catch (err) {
      throw new errorConstructor(message);
    }
  }
}

import jwt from "jsonwebtoken";
import { GENERAL_CONFIG } from "@root/configs/general.config";

const { ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN } = GENERAL_CONFIG;

export class AuthUtil {
  static async createTokenPair(
    payload: string | object | Buffer,
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
}

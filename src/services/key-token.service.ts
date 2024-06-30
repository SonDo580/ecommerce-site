import { KeyToken } from "@root/models/key-token.model";

export class KeyTokenService {
  static async createKeyToken(
    shopId: string,
    publicKey: string
  ): Promise<void> {
    await KeyToken.create({
      shop: shopId,
      publicKey,
    });
  }
}

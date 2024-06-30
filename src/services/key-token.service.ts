import { KeyTokenModel } from "@root/models/key-token.model";

export class KeyTokenService {
  static async createKeyToken(
    shopId: string,
    publicKey: string
  ): Promise<void> {
    await KeyTokenModel.create({
      shop: shopId,
      publicKey,
    });
  }
}

import { KeyTokenModel } from "@root/models/key-token.model";

export class KeyTokenService {
  static async upsertKeyToken(
    shopId: string,
    publicKey: string,
    refreshToken: string
  ) {
    const existingRecord = await KeyTokenModel.findOne({ shop: shopId });

    if (!existingRecord) {
      await KeyTokenModel.create({
        shop: shopId,
        publicKey,
        refreshToken,
      });
      return;
    }

    existingRecord.usedRefreshTokens.push(existingRecord.refreshToken);
    existingRecord.publicKey = publicKey;
    existingRecord.refreshToken = refreshToken;
    await existingRecord.save();
  }
}

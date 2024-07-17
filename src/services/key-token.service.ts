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

  static async findByShopId(shopId: string) {
    return await KeyTokenModel.findOne({ shop: shopId }).lean();
  }

  static async findInUsedRefreshTokens(refreshToken: string) {
    return await KeyTokenModel.findOne({
      usedRefreshTokens: refreshToken,
    }).lean();
  }

  static async findByRefreshToken(refreshToken: string) {
    return await KeyTokenModel.findOne({ refreshToken }).lean();
  }

  static async deleteById(id: string) {
    return await KeyTokenModel.deleteOne({ _id: id });
  }

  static async deleteByShopId(shopId: string) {
    return await KeyTokenModel.deleteOne({ shop: shopId });
  }
}

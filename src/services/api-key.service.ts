import { ApiKeyModel, IApiKey } from "@root/models/api-key.model";

export class ApiKeyService {
  static async findKey(key: string): Promise<IApiKey | null> {
    return await ApiKeyModel.findOne({ key, status: true }).lean();
  }

  static async createTestKey(): Promise<void> {
    const key = crypto.getRandomValues(new Uint32Array(10));
    await ApiKeyModel.create({ key, permissions: ["0000"] });
  }
}

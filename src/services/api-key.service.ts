import { ApiKeyModel } from "@root/models/api-key.model";

export class ApiKeyService {
  static async findKey(key: string) {
    return await ApiKeyModel.findOne({ key, status: true }).lean();
  }
}

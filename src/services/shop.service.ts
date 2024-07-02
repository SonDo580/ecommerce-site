import bcrypt from "bcrypt";

import { ShopModel } from "@root/models/shop.model";
import { CreateShopPayload } from "@root/interfaces/payloads/create-shop.payload";

export class ShopService {
  static async findByEmail(email: string) {
    return await ShopModel.findOne({ email }).lean();
  }

  static async create({ name, email, password, roles }: CreateShopPayload) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await ShopModel.create({
      name,
      email,
      password: hashedPassword,
      roles,
    });
  }
}

import { Response } from "express";

import { CreatedResponse } from "@root/core/success.response";
import { CustomRequest } from "@root/interfaces/custom-request.interface";
import { ProductFactory } from "@root/services/product.service";

export class ProductController {
  static async createProduct(req: CustomRequest, res: Response) {
    const { shopId } = req.shop!;
    const result = await ProductFactory.createProduct({ ...req.body, shopId });
    new CreatedResponse(result).send(res);
  }
}

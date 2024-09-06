import { Response } from "express";

import { CreatedResponse, SuccessResponse } from "@root/core/success.response";
import { CustomRequest } from "@root/interfaces/custom-request.interface";
import { ProductFactory } from "@root/services/product.factory";
import { ProductService } from "@root/services/product.service";

export class ProductController {
  static async createProduct(req: CustomRequest, res: Response) {
    const { shopId } = req.shop!;
    const result = await ProductFactory.createProduct({ ...req.body, shopId });
    new CreatedResponse(result).send(res);
  }

  static async publishProduct(req: CustomRequest, res: Response) {
    const { shopId } = req.shop!;
    const productId = req.params.id;

    const result = await ProductService.publishProduct(shopId, productId);
    new SuccessResponse(result).send(res);
  }

  static async unPublishProduct(req: CustomRequest, res: Response) {
    const { shopId } = req.shop!;
    const productId = req.params.id;

    const result = await ProductService.unPublishProduct(shopId, productId);
    new SuccessResponse(result).send(res);
  }

  static async findDrafts(req: CustomRequest, res: Response) {
    const { shopId } = req.shop!;
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 50;

    const result = await ProductService.findDrafts(shopId, { page, size });
    new SuccessResponse(result).send(res);
  }

  static async findPublished(req: CustomRequest, res: Response) {
    const { shopId } = req.shop!;
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 50;

    const result = await ProductService.findPublished(shopId, {
      page,
      size,
    });
    new SuccessResponse(result).send(res);
  }

  static async findProductsForUser(req: CustomRequest, res: Response) {
    const page = Number(req.query.page) || 1;
    const size = Number(req.query.size) || 50;
    const keyword = (req.query.keyword as string) || "";

    const result = await ProductService.findProductsForUser({
      page,
      size,
      keyword,
    });
    new SuccessResponse(result).send(res);
  }

  static async findProduct(req: CustomRequest, res: Response) {
    const productId = req.params.id;
    const result = await ProductService.findProduct(productId);
    new SuccessResponse(result).send(res);
  }
}

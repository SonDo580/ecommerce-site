import { Response } from "express";

import { CreatedResponse, SuccessResponse } from "@root/core/success.response";
import { CustomRequest } from "@root/interfaces/custom-request.interface";
import { ProductFactory } from "@root/services/product.factory";
import { ProductService } from "@root/services/product.service";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@root/constants/query.const";

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

  static async findShopDraftProducts(req: CustomRequest, res: Response) {
    const { shopId } = req.shop!;
    const page = Number(req.query.page) || DEFAULT_PAGE;
    const size = Number(req.query.size) || DEFAULT_PAGE_SIZE;

    const result = await ProductService.findShopDraftProducts(shopId, {
      page,
      size,
    });
    new SuccessResponse(result).send(res);
  }

  static async findShopPublishedProducts(req: CustomRequest, res: Response) {
    const { shopId } = req.shop!;
    const page = Number(req.query.page) || DEFAULT_PAGE;
    const size = Number(req.query.size) || DEFAULT_PAGE_SIZE;

    const result = await ProductService.findShopPublishedProducts(shopId, {
      page,
      size,
    });
    new SuccessResponse(result).send(res);
  }

  static async findProductsForUser(req: CustomRequest, res: Response) {
    const page = Number(req.query.page) || DEFAULT_PAGE;
    const size = Number(req.query.size) || DEFAULT_PAGE_SIZE;
    const keyword = req.query.keyword as string | undefined;

    const result = await ProductService.findProductsForUser({
      page,
      size,
      keyword,
    });
    new SuccessResponse(result).send(res);
  }

  static async findProductForUser(req: CustomRequest, res: Response) {
    const productId = req.params.id;
    const result = await ProductService.findProductForUser(productId);
    new SuccessResponse(result).send(res);
  }
}

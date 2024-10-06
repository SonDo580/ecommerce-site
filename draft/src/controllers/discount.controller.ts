import { Response } from "express";

import { CreatedResponse, SuccessResponse } from "@root/core/success.response";
import { CustomRequest } from "@root/interfaces/custom-request.interface";
import { DiscountService } from "@root/services/discount.service";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@root/constants/query.const";

export class DiscountController {
  static async createDiscount(req: CustomRequest, res: Response) {
    const { shopId } = req.shop!;
    const result = await DiscountService.createDiscount({
      ...req.body,
      shopId,
    });
    new CreatedResponse(result).send(res);
  }

  static async updateDiscount(req: CustomRequest, res: Response) {
    //   TODO
  }

  static async getProductsWithDiscount(req: CustomRequest, res: Response) {
    const { shopId } = req.shop!;
    const page = Number(req.query.page) || DEFAULT_PAGE;
    const size = Number(req.query.size) || DEFAULT_PAGE_SIZE;
    const code = (req.query.code as string) || "";

    const result = await DiscountService.getProductsWithDiscount({
      shopId,
      page,
      size,
      code,
    });
    new SuccessResponse(result).send(res);
  }

  static async getDiscountCodesByShop(req: CustomRequest, res: Response) {
    const { shopId } = req.shop!;
    const page = Number(req.query.page) || DEFAULT_PAGE;
    const size = Number(req.query.size) || DEFAULT_PAGE_SIZE;

    const result = await DiscountService.getDiscountCodesByShop({
      shopId,
      page,
      size,
    });
    new SuccessResponse(result).send(res);
  }

  static async getDiscountAmount(req: CustomRequest, res: Response) {
    const result = await DiscountService.getDiscountAmount(req.body);
    new SuccessResponse(result).send(res);
  }
}

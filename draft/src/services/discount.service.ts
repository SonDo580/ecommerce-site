import { CreateDiscountPayload } from "@root/interfaces/requests/create-discount.request";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "@root/core/error.response";
import { ErrorMessage } from "@root/constants/message.const";
import { DiscountModel } from "@root/models/discount.model";
import { PagingRequest } from "@root/interfaces/requests/list.request";
import { DiscountScope, DiscountType } from "@root/constants";
import {
  IProductDocument,
  ProductModel,
} from "@root/models/products/product.model";

export class DiscountService {
  static async createDiscount({
    name,
    description,
    type,
    value,
    code,
    startDate,
    endDate,
    maxUses,
    maxUsesPerUser,
    minOrderValue,
    shopId,
    scope,
    productIds,
    active,
  }: CreateDiscountPayload) {
    if (!DiscountService.isValidDateRange(startDate, endDate)) {
      throw new BadRequestError(ErrorMessage.INVALID_DATE_RANGE);
    }

    const existingDiscount = await DiscountModel.findOne({
      code,
      shop: shopId,
    }).lean();

    if (existingDiscount?.active) {
      throw new ConflictError(ErrorMessage.DISCOUNT_EXISTED);
    }

    return await DiscountModel.create({
      name,
      description,
      type,
      value,
      code,
      startDate,
      endDate,
      maxUses,
      maxUsesPerUser,
      minOrderValue,
      shop: shopId,
      scope,
      products: productIds,
      active,
    });
  }

  static async updateDiscount() {
    // TODO
  }

  private static isValidDateRange(
    startDate: Date | string,
    endDate: Date | string
  ): boolean {
    const current = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= current && start < end && end > current;
  }

  static async getProductsWithDiscount({
    code,
    shopId,
    page,
    size,
  }: PagingRequest & { code: string; shopId: string }) {
    const discount = await DiscountModel.findOne({
      code,
      shop: shopId,
    }).lean();

    if (!discount?.active) {
      throw new NotFoundError(ErrorMessage.DISCOUNT_NOT_FOUND);
    }

    const { scope, appliedProducts } = discount;
    let products: IProductDocument[] = [];
    switch (scope) {
      case DiscountScope.ALL:
        products = await ProductModel.find({
          published: true,
        })
          .select("name")
          .sort("ctime")
          .skip((page - 1) * size)
          .limit(size)
          .lean();
        break;
      case DiscountScope.SPECIFIC:
        products = await ProductModel.find({
          published: true,
          _id: { $in: appliedProducts },
        })
          .select("name")
          .sort("ctime")
          .skip((page - 1) * size)
          .limit(size)
          .lean();
        break;
      default:
        break;
    }

    return products;
  }

  static async getDiscountCodesByShop({
    shopId,
    page,
    size,
  }: PagingRequest & { shopId: string }) {
    return await DiscountModel.find({
      active: true,
      shop: shopId,
    })
      .select("code name")
      .skip((page - 1) * size)
      .limit(size)
      .lean();
  }

  static async getDiscountAmount({
    code,
    shopId,
    userId,
    products,
  }: {
    code: string;
    shopId: string;
    userId: string;
    products: any[];
  }) {
    const discount = await DiscountModel.findOne({
      code,
      shop: shopId,
    }).lean();

    if (!discount?.active) {
      throw new NotFoundError(ErrorMessage.DISCOUNT_NOT_FOUND);
    }

    if (discount.maxUses === discount.usesCount) {
      throw new BadRequestError(ErrorMessage.DISCOUNT_USAGE_LIMIT_REACHED);
    }

    if (new Date(discount.endDate) > new Date()) {
      throw new BadRequestError(ErrorMessage.DISCOUNT_EXPIRED);
    }

    const totalOrderAmount = products.reduce(
      (acc, { price, quantity }) => acc + quantity * price,
      0
    );

    if (discount.minOrderValue > totalOrderAmount) {
      throw new BadRequestError(ErrorMessage.ORDER_NOT_ENOUGH_FOR_DISCOUNT);
    }

    const countUsesByUser = discount.users.reduce(
      (acc, id) => acc + (id.toString() === userId ? 1 : 0),
      0
    );
    if (countUsesByUser === discount.maxUsesPerUser) {
      throw new BadRequestError(ErrorMessage.DISCOUNT_USAGE_LIMIT_REACHED);
    }

    const discountAmount =
      discount.type === DiscountType.AMOUNT
        ? discount.value
        : (totalOrderAmount * discount.value) / 100;

    return {
      totalOrderAmount,
      discountAmount,
      totalPrice: totalOrderAmount - discountAmount,
    };
  }

  static async deleteDiscount({
    code,
    shopId,
  }: {
    code: string;
    shopId: string;
  }) {
    // TODO:
    // - soft delete (save to a separate collection)
    // - check if it is being used in a cart
    await DiscountModel.findOneAndDelete({
      code,
      shop: shopId,
    });
  }

  static async cancelUserDiscount({
    code,
    shopId,
    userId,
  }: {
    code: string;
    shopId: string;
    userId: string;
  }) {
    const discount = await DiscountModel.findOne({
      code,
      shop: shopId,
    }).lean();

    if (!discount) {
      throw new NotFoundError(ErrorMessage.DISCOUNT_NOT_FOUND);
    }

    const result = await DiscountModel.findByIdAndUpdate(discount._id, {
      $pull: {
        users: userId,
      },
      $inc: {
        usesCount: -1,
      },
    });

    return result;
  }
}

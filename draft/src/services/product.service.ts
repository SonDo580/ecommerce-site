import { ErrorMessage } from "@root/constants/message.const";
import { BadRequestError, NotFoundError } from "@root/core/error.response";
import {
  PagingRequest,
  PagingSearchRequest,
} from "@root/interfaces/requests/list.request";
import {
  IProductDocument,
  ProductModel,
} from "@root/models/products/product.model";

export class ProductService {
  private static async updatePublishStatus(
    shopId: string,
    productId: string,
    published: boolean
  ): Promise<boolean> {
    const product = await ProductModel.findOne({
      _id: productId,
      shop: shopId,
    });

    if (!product) {
      throw new NotFoundError(ErrorMessage.PRODUCT_NOT_FOUND);
    }

    if (product.published) {
      throw new BadRequestError(ErrorMessage.PRODUCT_ALREADY_PUBLISHED);
    }

    const { modifiedCount } = await ProductModel.updateOne(
      { _id: productId },
      { published }
    );

    return modifiedCount > 0;
  }

  static async publishProduct(
    shopId: string,
    productId: string
  ): Promise<boolean> {
    return await this.updatePublishStatus(shopId, productId, true);
  }

  static async unPublishProduct(
    shopId: string,
    productId: string
  ): Promise<boolean> {
    return await this.updatePublishStatus(shopId, productId, false);
  }

  private static async findShopProducts(
    shopId: string,
    { page, size }: PagingRequest,
    published: boolean
  ): Promise<IProductDocument[]> {
    return await ProductModel.find({ shop: shopId, published })
      .populate("shop", "name email -_id")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * size)
      .limit(size)
      .lean();
  }

  static async findShopDraftProducts(
    shopId: string,
    { page, size }: PagingRequest
  ): Promise<IProductDocument[]> {
    return await this.findShopProducts(shopId, { page, size }, false);
  }

  static async findShopPublishedProducts(
    shopId: string,
    { page, size }: PagingRequest
  ): Promise<IProductDocument[]> {
    return await this.findShopProducts(shopId, { page, size }, true);
  }

  static async findProductsForUser({
    page,
    size,
    keyword,
  }: PagingSearchRequest): Promise<IProductDocument[]> {
    if (!keyword) {
      return await ProductModel.find({
        published: true,
      })
        .select("-__v -variations -createdAt -updatedAt")
        .skip((page - 1) * size)
        .limit(size)
        .lean();
    }

    return await ProductModel.find(
      {
        published: true,
        $text: { $search: keyword },
      },
      { score: { $meta: "textScore" } }
    )
      .select("-__v -variations -createdAt -updatedAt")
      .sort({ score: { $meta: "textScore" } })
      .skip((page - 1) * size)
      .limit(size)
      .lean();
  }

  static async findProductForUser(
    productId: string
  ): Promise<IProductDocument | null> {
    return await ProductModel.findOne({ _id: productId, published: true })
      .select("-__v -variations -createdAt -updatedAt")
      .lean();
  }
}

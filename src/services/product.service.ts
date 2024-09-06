import { ProductType } from "@root/constants";
import { ErrorMessage } from "@root/constants/message.const";
import { BadRequestError, NotFoundError } from "@root/core/error.response";
import {
  CreateProductRequest,
  ProductAttributes,
} from "@root/interfaces/requests/create-product.request";
import {
  PagingRequest,
  PagingSearchRequest,
} from "@root/interfaces/requests/list.request";
import { ClothingModel } from "@root/models/products/clothing.model";
import { ElectronicsModel } from "@root/models/products/electronics.model";
import { FurnitureModel } from "@root/models/products/furniture.model";
import {
  IProductDocument,
  ProductModel,
} from "@root/models/products/product.model";

export class ProductFactory {
  static productRegistry: {
    [type: string]: typeof Product;
  } = {};

  static registerProduct(type: ProductType, productClass: typeof Product) {
    ProductFactory.productRegistry[type] = productClass;
  }

  static async createProduct(
    payload: CreateProductRequest
  ): Promise<IProductDocument> {
    const productClass = ProductFactory.productRegistry[payload.type];
    if (!productClass) {
      throw new BadRequestError(ErrorMessage.INVALID_PRODUCT_TYPE);
    }
    return new productClass(payload).createProduct();
  }

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

  private static async findProducts(
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

  static async findDrafts(
    shopId: string,
    { page, size }: PagingRequest
  ): Promise<IProductDocument[]> {
    return await this.findProducts(shopId, { page, size }, false);
  }

  static async findPublished(
    shopId: string,
    { page, size }: PagingRequest
  ): Promise<IProductDocument[]> {
    return await this.findProducts(shopId, { page, size }, true);
  }

  static async findProductsForUser({
    page,
    size,
    keyword,
  }: PagingSearchRequest): Promise<IProductDocument[]> {
    return await ProductModel.find(
      {
        published: true,
        $text: { $search: keyword },
      },
      { score: { $meta: "textScore" } }
    )
      .select("-__v -variations")
      .populate("shop", "name email -_id")
      .sort({ score: { $meta: "textScore" } })
      .skip((page - 1) * size)
      .limit(size)
      .lean();
  }

  static async findProduct(
    productId: string
  ): Promise<IProductDocument | null> {
    return await ProductModel.findById(productId)
      .select("-__v -variations")
      .populate("shop", "name email -_id");
  }
}

class Product {
  name: string;
  description: string;
  thumbnail: string;
  price: number;
  quantity: number;
  type: ProductType;
  shop: string;
  attributes: ProductAttributes;

  constructor({
    name,
    description = "",
    thumbnail,
    price,
    quantity,
    type,
    shopId,
    attributes,
  }: CreateProductRequest) {
    this.name = name;
    this.description = description;
    this.thumbnail = thumbnail;
    this.price = price;
    this.quantity = quantity;
    this.type = type;
    this.shop = shopId;
    this.attributes = attributes;
  }

  async createProduct(productId?: string) {
    return await ProductModel.create({
      ...this,
      ...(productId ? { _id: productId } : {}),
    });
  }
}

class Clothing extends Product {
  async createProduct() {
    const clothing = await ClothingModel.create({
      ...this.attributes,
      shop: this.shop,
    });
    return await super.createProduct(clothing._id.toString());
  }
}

class Electronics extends Product {
  async createProduct() {
    const electronics = await ElectronicsModel.create({
      ...this.attributes,
      shop: this.shop,
    });
    return await super.createProduct(electronics._id.toString());
  }
}

class Furniture extends Product {
  async createProduct() {
    const furniture = await FurnitureModel.create({
      ...this.attributes,
      shop: this.shop,
    });
    return await super.createProduct(furniture._id.toString());
  }
}

const productClassDict = {
  [ProductType.CLOTHING]: Clothing,
  [ProductType.ELECTRONICS]: Electronics,
  [ProductType.FURNITURE]: Furniture,
};

for (const [type, productClass] of Object.entries(productClassDict)) {
  ProductFactory.registerProduct(type as ProductType, productClass);
}

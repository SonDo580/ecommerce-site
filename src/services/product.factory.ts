import { ProductType } from "@root/constants";
import { ErrorMessage } from "@root/constants/message.const";
import { BadRequestError, NotFoundError } from "@root/core/error.response";
import {
  CreateProductRequest,
  ProductAttributes,
} from "@root/interfaces/requests/create-product.request";
import { PatchProductRequest } from "@root/interfaces/requests/update-product.request";
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

  static async updateProduct(productId: string, payload: PatchProductRequest) {
    const productClass = ProductFactory.productRegistry[payload.type];
    if (!productClass) {
      throw new BadRequestError(ErrorMessage.INVALID_PRODUCT_TYPE);
    }
    return productClass.updateProduct(productId, payload);
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

  static async updateProduct(productId: string, payload: PatchProductRequest) {
    return await ProductModel.findOneAndUpdate(
      { _id: productId, shop: payload.shopId, type: payload.type },
      payload,
      { new: true }
    );
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

  static async updateProduct(productId: string, payload: PatchProductRequest) {
    // TODO: 
    // Remove null/undefined attribute
    // Update nested object
    // Refactor code: extract common operations

    if (
      !(await ProductModel.exists({
        _id: productId,
        shop: payload.shopId,
        type: payload.type,
      }))
    ) {
      throw new NotFoundError(ErrorMessage.PRODUCT_NOT_FOUND);
    }

    if (payload.attributes) {
      await ClothingModel.findOneAndUpdate(
        { _id: productId, shop: payload.shopId },
        payload.attributes
      );
    }
    return await super.updateProduct(productId, payload);
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

  static async updateProduct(productId: string, payload: PatchProductRequest) {
    if (
      !(await ProductModel.exists({
        _id: productId,
        shop: payload.shopId,
        type: payload.type,
      }))
    ) {
      throw new NotFoundError(ErrorMessage.PRODUCT_NOT_FOUND);
    }

    if (payload.attributes) {
      await ElectronicsModel.findOneAndUpdate(
        { _id: productId, shop: payload.shopId },
        payload.attributes
      );
    }
    return await super.updateProduct(productId, payload);
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

  static async updateProduct(productId: string, payload: PatchProductRequest) {
    if (
      !(await ProductModel.exists({
        _id: productId,
        shop: payload.shopId,
        type: payload.type,
      }))
    ) {
      throw new NotFoundError(ErrorMessage.PRODUCT_NOT_FOUND);
    }

    if (payload.attributes) {
      await FurnitureModel.findOneAndUpdate(
        { _id: productId, shop: payload.shopId },
        payload.attributes
      );
    }
    return await super.updateProduct(productId, payload);
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

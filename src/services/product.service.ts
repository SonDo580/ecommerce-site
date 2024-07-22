import { ProductType } from "@root/constants";
import { ErrorMessage } from "@root/constants/message.const";
import { BadRequestError } from "@root/core/error.response";
import { CreateProductRequest, ProductAttributes } from "@root/interfaces/requests/create-product.request";
import { ClothingModel } from "@root/models/products/clothing.model";
import { ElectronicsModel } from "@root/models/products/electronics.model";
import {
  IProductDocument,
  ProductModel,
} from "@root/models/products/product.model";

export class ProductFactory {
  static async createProduct(
    payload: CreateProductRequest
  ): Promise<IProductDocument> {
    switch (payload.type) {
      case ProductType.CLOTHING:
        return new Clothing(payload).createProduct();
      case ProductType.ELECTRONICS:
        return new Electronics(payload).createProduct();
      default:
        throw new BadRequestError(ErrorMessage.INVALID_PRODUCT_TYPE);
    }
  }
}

class Product {
  name: string;
  description: string;
  thumbnail: string;
  price: number;
  quantity: number;
  type: ProductType;
  shopId: string;
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
    this.shopId = shopId;
    this.attributes = attributes;
  }

  async createProduct() {
    return await ProductModel.create(this);
  }
}

class Clothing extends Product {
  async createProduct() {
    await ClothingModel.create(this.attributes);
    return await super.createProduct();
  }
}

class Electronics extends Product {
  async createProduct() {
    await ElectronicsModel.create(this.attributes);
    return await super.createProduct();
  }
}

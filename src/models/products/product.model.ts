import { Document, ObjectId, Schema, model } from "mongoose";
import { MODEL_NAME, ProductType } from "@root/constants";
import { IBaseEntity } from "@root/interfaces/base-entity.interface";

export interface IProduct extends IBaseEntity {
  name: string;
  description: string;
  thumbnail: string;
  price: number;
  quantity: number;
  type: ProductType;
  shop: ObjectId;
  attributes: any;
}

export interface IProductDocument extends Omit<IProduct, "_id">, Document {}

const productSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(ProductType),
      required: true,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAME.SHOP,
    },
    attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = model<IProductDocument>(
  MODEL_NAME.PRODUCT,
  productSchema
);

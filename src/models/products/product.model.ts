import { Document, ObjectId, Schema, model } from "mongoose";
import slugify from "slugify";
import { MODEL_NAME, ProductType } from "@root/constants";
import { IBaseEntity } from "@root/interfaces/base-entity.interface";
import {
  DEFAULT_AVERAGE_RATING,
  MAX_RATING,
  MIN_RATING,
} from "@root/constants/product.const";
import { NumberUtil } from "@root/utils/number.util";

export interface IProduct extends IBaseEntity {
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  quantity: number;
  type: ProductType;
  shop: ObjectId;
  attributes: any;
  averageRating: number;
  variations: string[];
  published: boolean;
}

export interface IProductDocument extends Omit<IProduct, "_id">, Document {}

const productSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
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
      required: true,
    },
    attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    averageRating: {
      type: Number,
      default: DEFAULT_AVERAGE_RATING,
      min: MIN_RATING,
      max: MAX_RATING,
      set: (val: number) => NumberUtil.round(val, 1),
    },
    variations: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching
productSchema.index({ name: "text", description: "text" });

// Middleware
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  console.log(this.slug);
  next();
});

export const ProductModel = model<IProductDocument>(
  MODEL_NAME.PRODUCT,
  productSchema
);

import { Document, ObjectId, Schema, model } from "mongoose";
import { DiscountScope, DiscountType, MODEL_NAME } from "@root/constants";
import { IBaseEntity } from "@root/interfaces/base-entity.interface";

export interface IDiscount extends IBaseEntity {
  name: string;
  description: string;
  type: DiscountType;
  value: number;
  code: string;
  startDate: Date;
  endDate: Date;
  maxUses: number;
  usesCount: number;
  users: ObjectId[];
  maxUsesPerUser: number;
  minOrderValue: number;
  shop: ObjectId;
  active?: boolean;
  scope: DiscountScope;
  appliedProducts?: ObjectId[];
}

export interface IDiscountDocument extends Omit<IDiscount, "_id">, Document {}

const discountSchema = new Schema<IDiscountDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(DiscountType),
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    maxUses: {
      type: Number,
      required: true,
    },
    maxUsesPerUser: {
      type: Number,
      required: true,
    },
    minOrderValue: {
      type: Number,
      required: true,
    },
    usesCount: {
      type: Number,
      default: 0,
    },
    users: { type: [Schema.Types.ObjectId], default: [] },
    shop: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAME.SHOP,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    scope: {
      type: String,
      enum: Object.values(DiscountScope),
      required: true,
    },
    appliedProducts: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const DiscountModel = model<IDiscountDocument>(
  MODEL_NAME.DISCOUNT,
  discountSchema
);

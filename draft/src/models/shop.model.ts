import { Document, Schema, model } from "mongoose";
import { MODEL_NAME, Role, ShopStatus } from "@root/constants";
import { IBaseEntity } from "@root/interfaces/base-entity.interface";

export interface IShop extends IBaseEntity {
  name: string;
  email: string;
  password: string;
  status: string;
  verify: boolean;
  roles: Role[];
}

export interface IShopDocument extends Omit<IShop, "_id">, Document {}

const shopSchema = new Schema<IShopDocument>(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ShopStatus),
      default: ShopStatus.INACTIVE,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: [
        {
          type: String,
          enum: Object.values(Role),
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const ShopModel = model<IShopDocument>(MODEL_NAME.SHOP, shopSchema);

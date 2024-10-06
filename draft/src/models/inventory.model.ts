import { Document, Mixed, ObjectId, Schema, model } from "mongoose";
import { MODEL_NAME } from "@root/constants";
import { IBaseEntity } from "@root/interfaces/base-entity.interface";

export interface IInventory extends IBaseEntity {
  product: ObjectId;
  shop: ObjectId;
  location: string;
  stock: number;
  reservations: Mixed[];
}

export interface IInventoryDocument extends Omit<IInventory, "_id">, Document {}

const inventorySchema = new Schema<IInventoryDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAME.PRODUCT,
      required: true,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAME.SHOP,
      required: true,
    },
    location: { type: String },
    stock: { type: Number, required: true },
    reservations: { type: [Schema.Types.Mixed], default: [] },
  },
  {
    timestamps: true,
  }
);

export const InventoryModel = model<IInventoryDocument>(
  MODEL_NAME.INVENTORY,
  inventorySchema
);

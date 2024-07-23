import { ObjectId, Schema, model } from "mongoose";
import { MODEL_NAME } from "@root/constants";
import { IBaseEntity } from "@root/interfaces/base-entity.interface";

export interface IFurniture extends IBaseEntity {
  brand: string;
  size?: string;
  material?: string;
  shop: ObjectId;
}

export interface IFurnitureDocument extends Omit<IFurniture, "_id">, Document {}

const furnitureSchema = new Schema<IFurnitureDocument>(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    shop: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAME.SHOP,
    },
  },
  {
    timestamps: true,
  }
);

export const FurnitureModel = model<IFurnitureDocument>(
  MODEL_NAME.FURNITURE,
  furnitureSchema
);

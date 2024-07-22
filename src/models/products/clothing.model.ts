import { Schema, model } from "mongoose";
import { ClothSize, MODEL_NAME } from "@root/constants";
import { IBaseEntity } from "@root/interfaces/base-entity.interface";

export interface IClothing extends IBaseEntity {
  brand: string;
  size?: ClothSize;
  material?: string;
}

export interface IClothingDocument extends Omit<IClothing, "_id">, Document {}

const clothingSchema = new Schema<IClothingDocument>(
  {
    brand: { type: String, required: true },
    size: { type: String, enum: Object.values(ClothSize) },
    material: String,
  },
  {
    timestamps: true,
  }
);

export const ClothingModel = model<IClothingDocument>(
  MODEL_NAME.CLOTHING,
  clothingSchema
);

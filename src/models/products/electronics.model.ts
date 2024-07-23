import { ObjectId, Schema, model } from "mongoose";
import { MODEL_NAME } from "@root/constants";
import { IBaseEntity } from "@root/interfaces/base-entity.interface";

export interface IElectronics extends IBaseEntity {
  manufacturer: string;
  model?: string;
  color?: string;
  shop: ObjectId;
}

export interface IElectronicsDocument
  extends Omit<IElectronics, "_id">,
    Document {}

const electronicsSchema = new Schema<IElectronicsDocument>(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    shop: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAME.SHOP,
    },
  },
  {
    timestamps: true,
  }
);

export const ElectronicsModel = model<IElectronicsDocument>(
  MODEL_NAME.ELECTRONICS,
  electronicsSchema
);

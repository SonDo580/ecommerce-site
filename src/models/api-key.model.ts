import { Document, Schema, model } from "mongoose";
import { MODEL_NAME } from "@root/constants";
import { IBaseEntity } from "@root/interfaces/base-entity.interface";

export interface IApiKey extends IBaseEntity {
  key: string;
  status: boolean;
  permissions: string[];
}

export interface IApiKeyDocument extends Omit<IApiKey, "_id">, Document {}

const apiKeySchema = new Schema<IApiKeyDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    timestamps: true,
  }
);

export const ApiKeyModel = model<IApiKeyDocument>(
  MODEL_NAME.API_KEY,
  apiKeySchema
);

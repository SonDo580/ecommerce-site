import { Schema, model } from "mongoose";
import { MODEL_NAME } from "@root/constants";

const apiKeySchema = new Schema(
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

export const ApiKeyModel = model(MODEL_NAME.API_KEY, apiKeySchema);

export interface IApiKey {
  key: string;
  status: boolean;
  permissions: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

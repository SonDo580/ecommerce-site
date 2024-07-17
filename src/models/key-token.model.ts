import { Document, ObjectId, Schema, model } from "mongoose";
import { MODEL_NAME } from "@root/constants";
import { IBaseEntity } from "@root/interfaces/base-entity.interface";

export interface IKeyToken extends IBaseEntity {
  shop: ObjectId;
  publicKey: string;
  refreshToken: string;
  usedRefreshTokens: string[];
}

export interface IKeyTokenDocument extends Omit<IKeyToken, "_id">, Document {}

const keyTokenSchema = new Schema<IKeyTokenDocument>(
  {
    shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: MODEL_NAME.SHOP,
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    usedRefreshTokens: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const KeyTokenModel = model<IKeyTokenDocument>(
  MODEL_NAME.KEY_TOKEN,
  keyTokenSchema
);

import { Schema, model } from "mongoose";
import { MODEL_NAME } from "@root/constants";

const keyTokenSchema = new Schema({
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
    type: Array,
    default: [],
  },
}, {
  timestamps: true
});

export const KeyTokenModel = model(MODEL_NAME.KEY_TOKEN, keyTokenSchema);

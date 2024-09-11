import { ProductType } from "@root/constants";
import {
  ClothingAttributes,
  ElectronicsAttributes,
  FurnitureAttributes,
} from "./create-product.request";

export type PatchProductAttributes =
  | Partial<ClothingAttributes>
  | Partial<ElectronicsAttributes>
  | Partial<FurnitureAttributes>;

export interface PatchProductRequest {
  shopId: string;
  type: ProductType;

  name?: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  quantity?: number;
  attributes?: PatchProductAttributes;
}

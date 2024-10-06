import { ClothSize, ProductType } from "@root/constants";

export interface ClothingAttributes {
  brand: string;
  size?: ClothSize;
  material?: string;
}

export interface ElectronicsAttributes {
  manufacturer: string;
  model?: string;
  color?: string;
}

export interface FurnitureAttributes {
  brand: string;
  size?: string;
  material?: string;
}

export type ProductAttributes =
  | ClothingAttributes
  | ElectronicsAttributes
  | FurnitureAttributes;

export interface CreateProductRequest {
  name: string;
  description?: string;
  thumbnail: string;
  price: number;
  quantity: number;
  type: ProductType;
  shopId: string;
  attributes: ProductAttributes;
}

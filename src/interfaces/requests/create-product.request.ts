import { ClothSize, ProductType } from "@root/constants";

interface ClothingAttributes {
  brand: string;
  size?: ClothSize;
  material?: string;
}

interface ElectronicsAttributes {
  manufacturer: string;
  model?: string;
  color?: string;
}

export interface ProductAttributes
  extends ClothingAttributes,
    ElectronicsAttributes {}

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

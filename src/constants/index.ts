export const MODEL_NAME = {
  API_KEY: "ApiKey",
  KEY_TOKEN: "KeyToken",
  SHOP: "Shop",

  PRODUCT: "Product",
  CLOTHING: "Clothing",
  ELECTRONICS: "Electronics",
};

export enum Role {
  SHOP = "SHOP",
  WRITER = "WRITER",
  EDITOR = "EDITOR",
  ADMIN = "ADMIN",
}

export enum ShopStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export enum NodeEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export enum Headers {
  API_KEY = "x-api-key",
  CLIENT_ID = "x-client-id",
  AUTHORIZATION = "authorization",
  REFRESH_TOKEN = "refresh-token",
}

export enum ProductType {
  ELECTRONICS = "Electronics",
  CLOTHING = "Clothing",
}

export enum ClothSize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}

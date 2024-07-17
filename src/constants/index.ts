export const MODEL_NAME = {
  SHOP: "Shop",
  KEY_TOKEN: "KeyToken",
  API_KEY: "ApiKey",
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

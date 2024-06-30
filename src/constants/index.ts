const MODEL_NAME = {
  SHOP: "Shop",
  KEY: "Key",
};

enum Role {
  SHOP = "SHOP",
  WRITER = "WRITER",
  EDITOR = "EDITOR",
  ADMIN = "ADMIN",
}

enum ShopStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

enum NodeEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export { MODEL_NAME, Role, NodeEnv, ShopStatus };

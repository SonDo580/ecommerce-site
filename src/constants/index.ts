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

enum NodeEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export { MODEL_NAME, Role, NodeEnv };

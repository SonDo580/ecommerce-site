import dotenv from "dotenv";
import { NodeEnv } from "@root/constants";

dotenv.config();

const { MONGODB_URL, PORT, NODE_ENV, ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN } =
  process.env;

export const GENERAL_CONFIG = {
  MONGODB_URL: MONGODB_URL!,
  PORT: Number(PORT) || 5000,
  NODE_ENV: NODE_ENV || NodeEnv.DEVELOPMENT,
  ACCESS_EXPIRES_IN: ACCESS_EXPIRES_IN || "2d",
  REFRESH_EXPIRES_IN: REFRESH_EXPIRES_IN || "7d",
};

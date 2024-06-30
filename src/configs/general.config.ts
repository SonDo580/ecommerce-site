import dotenv from "dotenv";
import { NodeEnv } from "@root/constants";

dotenv.config();

const { MONGODB_URL, PORT, NODE_ENV } = process.env;

const GENERAL_CONFIG = {
  MONGODB_URL: MONGODB_URL!,
  PORT: Number(PORT) || 5000,
  NODE_ENV: NODE_ENV || NodeEnv.DEVELOPMENT,
};

export { GENERAL_CONFIG };

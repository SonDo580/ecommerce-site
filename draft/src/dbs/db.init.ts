import mongoose from "mongoose";

import { DatabaseHelper } from "@root/helpers/db.helper";
import { MAX_POOL_SIZE } from "@root/constants/db.const";
import { GENERAL_CONFIG } from "@root/configs/general.config";
import { NodeEnv } from "@root/constants";

const { MONGODB_URL, NODE_ENV } = GENERAL_CONFIG;

class Database {
  static instance: Database;

  constructor() {
    this.connect();
  }

  async connect(): Promise<void> {
    if (NODE_ENV === NodeEnv.DEVELOPMENT) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    try {
      const connectOptions: mongoose.ConnectOptions = {
        maxPoolSize: MAX_POOL_SIZE,
      };

      await mongoose.connect(MONGODB_URL, connectOptions);
      console.log("Database connected");

      // DatabaseHelper.countConnections();
      // DatabaseHelper.periodicChecking();
    } catch (err) {
      console.log(err);
    }
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

Database.getInstance();

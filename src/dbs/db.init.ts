import mongoose from "mongoose";

import { DatabaseHelper } from "@root/helpers/db.helper";
import { MAX_POOL_SIZE } from "@root/constants/db.const";

class Database {
  static instance: Database;

  constructor() {
    this.connect();
  }

  async connect(): Promise<void> {
    if (process.env.NODE_ENV === "development") {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    try {
      const connectOptions: mongoose.ConnectOptions = {
        maxPoolSize: MAX_POOL_SIZE,
      };

      await mongoose.connect(process.env.MONGODB_URL!, connectOptions);
      console.log("Database connected");

      DatabaseHelper.countConnections();
      DatabaseHelper.periodicChecking();
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

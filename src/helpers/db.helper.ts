import mongoose from "mongoose";

import {
  CHECKING_INTERVAL,
  maxNumberOfConnections,
} from "@root/constants/db.const";

export class DatabaseHelper {
  static countConnections() {
    const numberOfConnections = mongoose.connections.length;
    console.log(`Number of connections: ${numberOfConnections}`);
  }

  static periodicChecking() {
    setInterval(() => {
      this.checkOverload();
      this.checkMemoryUsage();
    }, CHECKING_INTERVAL);
  }

  private static checkOverload() {
    const numberOfConnections = mongoose.connections.length;
    console.log(`Active connections: ${numberOfConnections}`);

    if (numberOfConnections > maxNumberOfConnections) {
      console.log("Connection overload detected");
    }
  }

  private static checkMemoryUsage() {
    const memoryUsed = process.memoryUsage().rss;
    console.log(`Memory usage: ${memoryUsed / 1024 / 1024} MiB`);
  }
}

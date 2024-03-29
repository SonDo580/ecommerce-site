import mongoose from "mongoose";

import {
  CHECKING_INTERVAL,
  maxNumberOfConnections,
} from "@root/constants/db.const";

export class DatabaseHelper {
  static countConnections(): void {
    const numberOfConnections: number = mongoose.connections.length;
    console.log(`Number of connections: ${numberOfConnections}`);
  }

  static periodicChecking(): void {
    setInterval(() => {
      this.checkOverload();
      this.checkMemoryUsage();
    }, CHECKING_INTERVAL);
  }

  private static checkOverload(): void {
    const numberOfConnections: number = mongoose.connections.length;
    console.log(`Active connections: ${numberOfConnections}`);

    if (numberOfConnections > maxNumberOfConnections) {
      console.log("Connection overload detected");
    }
  }

  private static checkMemoryUsage(): void {
    const memoryUsed: number = this.getMemoryUsage();
    console.log(`Memory usage: ${memoryUsed / 1024 / 1024} MiB`);
  }

  /**
   * Get the Resident Set Size (RSS) in bytes.
   * (RSS is the portion of memory occupied by a process)
   */
  private static getMemoryUsage(): number {
    return process.memoryUsage().rss;
  }
}

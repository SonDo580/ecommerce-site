import mongoose from "mongoose";

import {
  CHECKING_INTERVAL,
  maxNumberOfConnections,
} from "@root/constants/db.const";
import { DataSizeUtil } from "@root/utils/data-size.util";
import { MemoryUnit } from "@root/constants/unit.const";

export class DatabaseHelper {
  private static intervalId: NodeJS.Timeout;

  static countConnections(): void {
    const numberOfConnections: number = mongoose.connections.length;
    console.log(`Number of connections: ${numberOfConnections}`);
  }

  static periodicChecking(): void {
    this.intervalId = setInterval(() => {
      this.checkOverload();
      this.checkMemoryUsage();
    }, CHECKING_INTERVAL);
  }

  static cleanUpBeforeExit(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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
    const sourceMemoryUnit: MemoryUnit = MemoryUnit.B;
    const targetMemoryUnit: MemoryUnit = MemoryUnit.MiB;

    const convertedMemoryUsed: number = DataSizeUtil.convert(
      memoryUsed,
      sourceMemoryUnit,
      targetMemoryUnit
    );

    console.log(`Memory usage: ${convertedMemoryUsed}${targetMemoryUnit}`);
  }

  /**
   * Get the Resident Set Size (RSS) in bytes.
   * (RSS is the portion of memory occupied by a process)
   */
  private static getMemoryUsage(): number {
    return process.memoryUsage().rss;
  }
}

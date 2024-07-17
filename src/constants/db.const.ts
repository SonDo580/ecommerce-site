import os from "os";

export const CHECKING_INTERVAL = 5000; // milliseconds
export const DB_CONNECTIONS_PER_CORE = 5; // assume that 1 CPU core can handle 5 MongoDB connections
export const MAX_POOL_SIZE = 50; // maximum number of connections in the pool

// Calculated
const numberOfCPUCores: number = os.cpus().length;

export const maxNumberOfConnections: number =
  numberOfCPUCores * DB_CONNECTIONS_PER_CORE;

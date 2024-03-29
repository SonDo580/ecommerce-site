import os from "os";

const CHECKING_INTERVAL = 5000; // miliseconds
const DB_CONNECTIONS_PER_CORE = 5; // assume that 1 CPU core can handle 5 MongoDB connections
const MAX_POOL_SIZE = 50; // maximum number of connections in the pool

// Calculated
const numberOfCPUCores: number = os.cpus().length;
const maxNumberOfConnections: number =
  numberOfCPUCores * DB_CONNECTIONS_PER_CORE;

export {
  CHECKING_INTERVAL,
  DB_CONNECTIONS_PER_CORE,
  MAX_POOL_SIZE,
  maxNumberOfConnections,
};

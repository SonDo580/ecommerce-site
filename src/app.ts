import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

import "./dbs/db.init";
import router from "./routes";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use("/", router);

// Handle error

export { app };

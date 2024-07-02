import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

import "./dbs/db.init";
import router from "./routes";
import {
  errorHandler,
} from "./middlewares/error-handler.middleware";
import { NotFoundError } from "./core/error.response";

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
app.use((req, res, next) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };

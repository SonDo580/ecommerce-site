import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

import "./dbs/db.init";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// Routers
app.get("/", (req, res, next) => {
  const str = "Hello Son";

  res.json({
    message: "Welcome",
    metadata: str.repeat(10000),
  });
});

// Handle error

export { app };

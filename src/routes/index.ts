import { Router } from "express";

import {
  checkApiKey,
  checkPermission,
} from "@root/middlewares/auth.middleware";
import { accessRouter } from "./access.route";
import { productRouter } from "./product.route";

const router = Router();

router.use(checkApiKey);
router.use(checkPermission("0000"));

router.use("/v1/api/product", productRouter);
router.use("/v1/api", accessRouter);

export default router;

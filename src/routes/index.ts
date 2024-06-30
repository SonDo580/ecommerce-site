import { Router } from "express";
import { accessRouter } from "./access.route";
import {
  checkApiKey,
  checkPermission,
} from "@root/middlewares/auth.middleware";

const router = Router();

router.use(checkApiKey);
router.use(checkPermission("0000"));
router.use("/v1/api", accessRouter);

export default router;

import { Router } from "express";

import { AccessController } from "@root/controllers/access.controller";
import { asyncHandler } from "@root/middlewares/error-handler.middleware";
import { checkAuthentication } from "@root/middlewares/auth.middleware";

const accessRouter = Router();

accessRouter.post("/shop/sign-up", asyncHandler(AccessController.signUp));
accessRouter.post("/shop/login", asyncHandler(AccessController.login));

accessRouter.use(checkAuthentication);
accessRouter.post("/shop/logout", asyncHandler(AccessController.logout));
accessRouter.post(
  "/shop/refresh-token",
  asyncHandler(AccessController.handleRefreshToken)
);

export { accessRouter };

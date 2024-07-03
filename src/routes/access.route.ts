import { Router } from "express";
import { AccessController } from "@root/controllers/access.controller";
import { asyncHandler } from "@root/middlewares/error-handler.middleware";

const accessRouter = Router();

accessRouter.post("/shop/sign-up", asyncHandler(AccessController.signUp));
accessRouter.post("/shop/login", asyncHandler(AccessController.login));

export { accessRouter };

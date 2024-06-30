import { Router } from "express";
import { AccessController } from "@root/controllers/access.controller";

const accessRouter = Router();
accessRouter.post("/shop/sign-up", AccessController.signUp);

export { accessRouter };

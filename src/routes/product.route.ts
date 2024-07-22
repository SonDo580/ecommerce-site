import { Router } from "express";

import { ProductController } from "@root/controllers/product.controller";
import { checkAuthentication } from "@root/middlewares/auth.middleware";
import { asyncHandler } from "@root/middlewares/error-handler.middleware";

const productRouter = Router();

productRouter.use(checkAuthentication);
productRouter.post("/", asyncHandler(ProductController.createProduct));

export { productRouter };

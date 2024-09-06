import { Router } from "express";

import { ProductController } from "@root/controllers/product.controller";
import { checkAuthentication } from "@root/middlewares/auth.middleware";
import { asyncHandler } from "@root/middlewares/error-handler.middleware";

const productRouter = Router();

productRouter.get("/search", asyncHandler(ProductController.findProductsForUser));

productRouter.use(checkAuthentication);

productRouter.post("/", asyncHandler(ProductController.createProduct));
productRouter.post(
  "/publish/:id",
  asyncHandler(ProductController.publishProduct)
);
productRouter.post(
  "/unpublish/:id",
  asyncHandler(ProductController.unPublishProduct)
);

productRouter.get("/drafts", asyncHandler(ProductController.findDrafts));
productRouter.get("/published", asyncHandler(ProductController.findPublished));

export { productRouter };

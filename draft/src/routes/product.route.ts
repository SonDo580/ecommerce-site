import { Router } from "express";

import { ProductController } from "@root/controllers/product.controller";
import { checkAuthentication } from "@root/middlewares/auth.middleware";
import { asyncHandler } from "@root/middlewares/error-handler.middleware";

const productRouter = Router();

productRouter.get("/", asyncHandler(ProductController.findProductsForUser));
productRouter.get("/:id", asyncHandler(ProductController.findProductForUser));

// **********
productRouter.use(checkAuthentication);
// **********

productRouter.post("/", asyncHandler(ProductController.createProduct));
productRouter.post(
  "/publish/:id",
  asyncHandler(ProductController.publishProduct)
);
productRouter.post(
  "/unpublish/:id",
  asyncHandler(ProductController.unPublishProduct)
);

productRouter.patch("/:id", asyncHandler(ProductController.updateProduct));

productRouter.get(
  "/drafts",
  asyncHandler(ProductController.findShopDraftProducts)
);
productRouter.get(
  "/published",
  asyncHandler(ProductController.findShopPublishedProducts)
);

export { productRouter };

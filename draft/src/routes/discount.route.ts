import { Router } from "express";

import { checkAuthentication } from "@root/middlewares/auth.middleware";
import { asyncHandler } from "@root/middlewares/error-handler.middleware";
import { DiscountController } from "@root/controllers/discount.controller";

const discountRouter = Router();

discountRouter.get(
  "/amount",
  asyncHandler(DiscountController.getDiscountAmount)
);
discountRouter.get(
  "/products",
  asyncHandler(DiscountController.getProductsWithDiscount)
);

// **********
discountRouter.use(checkAuthentication);
// **********

discountRouter.post("/", DiscountController.createDiscount);
discountRouter.get("/", DiscountController.getDiscountCodesByShop);

export { discountRouter };

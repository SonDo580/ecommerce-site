import { DiscountScope, DiscountType } from "@root/constants";

export interface CreateDiscountPayload {
  name: string;
  description: string;
  type: DiscountType;
  value: number;
  code: string;
  startDate: Date;
  endDate: Date;
  maxUses: number;
  maxUsesPerUser: number;
  minOrderValue: number;
  shopId: string;
  scope: DiscountScope;
  productIds?: string[];
  active?: boolean;
}

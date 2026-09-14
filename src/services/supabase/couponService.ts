import { supabase, isSupabaseConfigured } from "./client";
import type { Coupon, CouponValidationResult } from "../../types/coupon";

const ACTIVE_COUPONS: Coupon[] = [
  {
    id: "cpn-1",
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minimumOrder: 1000,
    maximumDiscount: 500,
    usedCount: 42,
    isActive: true,
  },
  {
    id: "cpn-2",
    code: "SWEET20",
    discountType: "percentage",
    discountValue: 20,
    minimumOrder: 2500,
    maximumDiscount: 1000,
    usedCount: 19,
    isActive: true,
  },
  {
    id: "cpn-3",
    code: "FREESHIP",
    discountType: "fixed",
    discountValue: 150,
    minimumOrder: 1200,
    usedCount: 88,
    isActive: true,
  },
];

export const couponService = {
  async validateCoupon(
    code: string,
    subtotal: number,
  ): Promise<CouponValidationResult> {
    const normalizedCode = code.trim().toUpperCase();

    let coupon: Coupon | undefined;

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", normalizedCode)
        .eq("is_active", true)
        .maybeSingle();

      if (!error && data) {
        coupon = {
          id: data.id,
          code: data.code,
          discountType: data.discount_type,
          discountValue: Number(data.discount_value),
          minimumOrder: Number(data.minimum_order) || 0,
          maximumDiscount: data.maximum_discount ? Number(data.maximum_discount) : undefined,
          usageLimit: data.usage_limit,
          usedCount: data.used_count || 0,
          isActive: data.is_active,
        };
      }
    }

    if (!coupon) {
      coupon = ACTIVE_COUPONS.find(
        (c) => c.code.toUpperCase() === normalizedCode && c.isActive,
      );
    }

    if (!coupon) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: "Invalid or expired coupon code",
      };
    }

    if (subtotal < coupon.minimumOrder) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: `Minimum order of Rs. ${coupon.minimumOrder} required for ${coupon.code}`,
      };
    }

    let discountAmount: number;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }

    return {
      isValid: true,
      coupon,
      discountAmount,
    };
  },
};

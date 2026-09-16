import { supabase, isSupabaseConfigured } from "./client";
import type { Coupon, CouponValidationResult } from "@src/types/coupon";

export const couponService = {
  async validateCoupon(
    code: string,
    subtotal: number,
  ): Promise<CouponValidationResult> {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: "Please enter a coupon code",
      };
    }

    if (!isSupabaseConfigured) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: "Coupon validation service is currently unavailable",
      };
    }

    // Query authoritative database coupon record
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .ilike("code", normalizedCode)
      .maybeSingle();

    if (error) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: `Coupon verification failed: ${error.message}`,
      };
    }

    if (!data) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: `Coupon "${normalizedCode}" does not exist`,
      };
    }

    const now = new Date();

    if (!data.is_active) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: `Coupon "${data.code}" is currently disabled`,
      };
    }

    if (data.start_date && new Date(data.start_date) > now) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: `Coupon "${data.code}" is not valid yet`,
      };
    }

    if (data.expiry_date && new Date(data.expiry_date) < now) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: `Coupon "${data.code}" expired on ${new Date(data.expiry_date).toLocaleDateString()}`,
      };
    }

    if (data.usage_limit && (data.used_count || 0) >= data.usage_limit) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: `Coupon "${data.code}" has reached its maximum redemptions`,
      };
    }

    const minimumOrder = Number(data.minimum_order) || 0;
    if (subtotal < minimumOrder) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: `Minimum order of Rs. ${minimumOrder} required for coupon ${data.code}`,
      };
    }

    const coupon: Coupon = {
      id: data.id,
      code: data.code,
      discountType: data.discount_type,
      discountValue: Number(data.discount_value),
      minimumOrder,
      maximumDiscount: data.maximum_discount ? Number(data.maximum_discount) : undefined,
      usageLimit: data.usage_limit,
      usedCount: data.used_count || 0,
      isActive: data.is_active,
    };

    let discountAmount: number;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }

    discountAmount = Math.min(discountAmount, subtotal);

    return {
      isValid: true,
      coupon,
      discountAmount,
    };
  },
};

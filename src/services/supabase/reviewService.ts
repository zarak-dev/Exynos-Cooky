import { supabase, isSupabaseConfigured } from "./client";
import type { Review, ReviewInput } from "../../types/review";

export const reviewService = {
  async fetchReviews(): Promise<Review[]> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot load reviews.");
    }

    // 1. Try secure public reviews RPC (protects customer email/phone)
    const { data: rpcReviews, error: rpcError } = await supabase.rpc(
      "get_public_reviews",
    );

    if (!rpcError && rpcReviews && rpcReviews.length > 0) {
      return rpcReviews.map(
        (row: {
          id: string;
          product_id: number;
          order_id?: string;
          rating: number;
          comment: string;
          verified_purchase: boolean;
          created_at: string;
          user_name: string;
          user_avatar: string;
        }) => ({
          id: row.id,
          productId: row.product_id,
          orderId: row.order_id,
          userName: row.user_name || "Verified Customer",
          userAvatar: row.user_avatar || "",
          rating: row.rating,
          comment: row.comment,
          verifiedPurchase: Boolean(row.verified_purchase),
          createdAt: row.created_at,
        }),
      );
    }

    // 2. Direct table select with privacy-safe profile selection
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        id,
        product_id,
        order_id,
        rating,
        comment,
        verified_purchase,
        created_at,
        profiles(full_name, avatar_url)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to load reviews: ${error.message}`);
    }

    type RawReviewRow = {
      id: string;
      product_id: number;
      order_id?: string;
      rating: number;
      comment: string;
      verified_purchase?: boolean;
      created_at: string;
      profiles?:
        | { full_name?: string; avatar_url?: string }
        | Array<{ full_name?: string; avatar_url?: string }>
        | null;
    };

    return (data as unknown as RawReviewRow[]).map((row) => {
      const profile = Array.isArray(row.profiles)
        ? row.profiles[0]
        : row.profiles;
      return {
        id: row.id,
        productId: row.product_id,
        orderId: row.order_id,
        userName: profile?.full_name || "Verified Customer",
        userAvatar: profile?.avatar_url || "",
        rating: row.rating,
        comment: row.comment,
        verifiedPurchase: Boolean(row.verified_purchase),
        createdAt: row.created_at,
      };
    });
  },

  async addReview(
    reviewInput: ReviewInput,
    user: { id: string; name: string; email: string },
  ): Promise<Review> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot submit review.");
    }

    // Client NEVER determines verified_purchase.
    // The PostgreSQL trigger authoritatively checks real order history
    // and enforces user_id = auth.uid().
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        product_id: reviewInput.productId,
        order_id: reviewInput.orderId || null,
        rating: reviewInput.rating,
        comment: reviewInput.comment,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Review submission failed: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      userName: user.name,
      userEmail: user.email,
      productId: data.product_id,
      orderId: data.order_id,
      rating: data.rating,
      comment: data.comment,
      verifiedPurchase: Boolean(data.verified_purchase),
      createdAt: data.created_at,
    };
  },
};

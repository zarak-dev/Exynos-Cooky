import { supabase, isSupabaseConfigured } from "./client";
import type { Review, ReviewInput } from "../../types/review";
import { loadFromStorage } from "../../utils/storage";

const LOCAL_STORAGE_REVIEWS_KEY = "exynos_reviews";

const SEED_REVIEWS: Review[] = [
  {
    id: "rev-1",
    userName: "Sarah Jenkins",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80&auto=format&fit=crop",
    rating: 5,
    comment: "Absolutely divine! The Lotus Biscoff melted in my mouth. Will order every week!",
    verifiedPurchase: true,
    createdAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "rev-2",
    userName: "Marcus Chen",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&auto=format&fit=crop",
    rating: 5,
    comment: "Best cookies in town, hands down. The box packaging is so cute too 🍪",
    verifiedPurchase: true,
    createdAt: "2026-03-02T12:30:00Z",
  },
  {
    id: "rev-3",
    userName: "Aisha Patel",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80&auto=format&fit=crop",
    rating: 5,
    comment: "Tried the Pink Velvet and I was blown away. Super fresh and perfectly soft.",
    verifiedPurchase: true,
    createdAt: "2026-03-03T15:45:00Z",
  },
  {
    id: "rev-4",
    userName: "David Miller",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&auto=format&fit=crop",
    rating: 5,
    comment: "Ordered for my daughter's birthday and everyone loved them. 10/10 recommend!",
    verifiedPurchase: true,
    createdAt: "2026-03-04T09:15:00Z",
  },
  {
    id: "rev-5",
    userName: "Elena Rostova",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80&auto=format&fit=crop",
    rating: 5,
    comment: "Fast delivery, gorgeous packaging, and insane flavors. Exynos Cooky is the real deal.",
    verifiedPurchase: true,
    createdAt: "2026-03-05T14:20:00Z",
  },
  {
    id: "rev-6",
    userName: "Tariq Al-Mansoor",
    userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80&auto=format&fit=crop",
    rating: 5,
    comment: "The S'mores cookie is absolutely unreal. Never tasted anything like it!",
    verifiedPurchase: true,
    createdAt: "2026-03-06T18:00:00Z",
  },
];

export const reviewService = {
  async fetchReviews(): Promise<Review[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          comment,
          verified_purchase,
          created_at,
          profiles(full_name, avatar_url, email)
        `)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        type RawReviewRow = {
          id: string;
          rating: number;
          comment: string;
          verified_purchase?: boolean;
          created_at: string;
          profiles?:
            | { full_name?: string; avatar_url?: string; email?: string }
            | Array<{ full_name?: string; avatar_url?: string; email?: string }>
            | null;
        };

        return (data as unknown as RawReviewRow[]).map((row) => {
          const profile = Array.isArray(row.profiles)
            ? row.profiles[0]
            : row.profiles;
          return {
            id: row.id,
            userName: profile?.full_name || "Verified Customer",
            userAvatar: profile?.avatar_url || "",
            userEmail: profile?.email || "",
            rating: row.rating,
            comment: row.comment,
            verifiedPurchase: row.verified_purchase ?? true,
            createdAt: row.created_at,
          };
        });
      }
    }

    return loadFromStorage<Review[]>(LOCAL_STORAGE_REVIEWS_KEY, SEED_REVIEWS);
  },

  async addReview(
    reviewInput: ReviewInput,
    user: { id: string; name: string; email: string },
  ): Promise<Review> {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      productId: reviewInput.productId,
      orderId: reviewInput.orderId,
      rating: reviewInput.rating,
      comment: reviewInput.comment,
      verifiedPurchase: true,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      await supabase.from("reviews").insert({
        user_id: user.id,
        product_id: reviewInput.productId,
        order_id: reviewInput.orderId,
        rating: reviewInput.rating,
        comment: reviewInput.comment,
        verified_purchase: true,
      });
    }

    const current = loadFromStorage<Review[]>(
      LOCAL_STORAGE_REVIEWS_KEY,
      SEED_REVIEWS,
    );
    const updated = [newReview, ...current];
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(updated));
    return newReview;
  },
};

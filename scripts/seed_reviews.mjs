import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const [k, ...v] = line.split("=");
  if (k && v.length) env[k.trim()] = v.join("=").trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);

const REVIEWERS = [
  {
    name: "Ayesha Malik",
    email: "ayesha.malik.reviews@gmail.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80&auto=format&fit=crop",
    productId: 6, // Lotus Biscoff Lava
    rating: 5,
    comment: "Yar Lotus Biscoff Lava to next level hai! Warm gooey center aur crunchy crumbs, Islamabad me aisi cookies pehle nahi khayein. Meri family har weekend 12-pack order karti hai!",
  },
  {
    name: "Hamza Tariq",
    email: "hamza.tariq.reviews@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&auto=format&fit=crop",
    productId: 24, // Midnight Cookies & Cream
    rating: 5,
    comment: "NUST me birthday ke liye 6-pack mangwaya tha. Midnight Cookies & Cream ne to dil jeet liya! Packaging bohat premium thi aur garam garam deliver hua.",
  },
  {
    name: "Zainab Rehman",
    email: "zainab.rehman.reviews@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80&auto=format&fit=crop",
    productId: 11, // Salted Caramel Crunch
    rating: 5,
    comment: "Pakistan me best gourmet cookies hain hands down! Salted Caramel Crunch ka meetha aur sea salt flakes ka balance bilkul perfect hai. Bohat lazeez!",
  },
  {
    name: "Bilal Khan",
    email: "bilal.khan.reviews@gmail.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&auto=format&fit=crop",
    productId: 7, // Chocolate Fudge
    rating: 5,
    comment: "Bhai sach me maza agaya! Chocolate Fudge ko microwave me 10 seconds garam kiya to bilkul fresh bakery jese melt horahi thi. 10/10 recommendation.",
  },
  {
    name: "Sara Ahmed",
    email: "sara.ahmed.reviews@gmail.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80&auto=format&fit=crop",
    productId: 3, // Pink Velvet
    rating: 5,
    comment: "Pink Velvet cookies dekhne me bhi itni pyaari hain aur taste to us se bhi behtareen! Super soft texture aur white chocolate chips ka maza hi alag hai.",
  },
  {
    name: "Danial Shah",
    email: "danial.shah.reviews@gmail.com",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80&auto=format&fit=crop",
    productId: 12, // S'mores Campfire
    rating: 5,
    comment: "S'mores Campfire with toasted marshmallows zabardast hai! F-7 me delivery bhi super fast thi aur cookies bilkul fresh aur warm theen.",
  },
  {
    name: "Mariam Farooq",
    email: "mariam.farooq.reviews@gmail.com",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80&auto=format&fit=crop",
    productId: 8, // Red Velvet Cream
    rating: 5,
    comment: "Exynos Cooky ne aam bakery ki cookies hamesha ke liye bhula di hain. Super fresh ingredients, portions bhi baray hain aur taste lajawab hai!",
  },
];

async function seedReviews() {
  console.log("=== STEP 1: Logging in as Admin to Clean Up ===");
  const { data: adminAuth, error: aErr } = await supabase.auth.signInWithPassword({
    email: "admin@ec.com",
    password: "password123",
  });
  console.log("Admin logged in:", adminAuth?.user?.id, "error:", aErr?.message);

  if (adminAuth?.user) {
    const { error: delErr } = await supabase.from("reviews").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    console.log("Admin bulk clear error:", delErr?.message || "None (all previous cleared)");
  }

  console.log("\n=== STEP 2: Creating Customer Profiles & Inserting 7 Real Roman Urdu Reviews ===");
  for (let i = 0; i < REVIEWERS.length; i++) {
    const rev = REVIEWERS[i];

    // Create client instance for each reviewer to manage their auth session
    const reviewerClient = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);

    let userId = null;

    // Try signIn with known passwords
    let { data: signInData } = await reviewerClient.auth.signInWithPassword({
      email: rev.email,
      password: "Password123!",
    });

    if (!signInData?.session) {
      const res = await reviewerClient.auth.signInWithPassword({
        email: rev.email,
        password: "ReviewerPass123!",
      });
      signInData = res.data;
    }

    if (signInData?.user) {
      userId = signInData.user.id;
      console.log(`[${i + 1}/7] Logged into account for ${rev.name}: ${userId}`);
    } else {
      console.error(`Failed to auth ${rev.name}`);
      continue;
    }

    // Explicitly delete any existing reviews by this reviewer to prevent duplicate cards
    await reviewerClient.from("reviews").delete().eq("user_id", userId);

    // Update profile with name and avatar
    await reviewerClient
      .from("profiles")
      .update({
        full_name: rev.name,
        avatar_url: rev.avatar,
      })
      .eq("id", userId);

    // Insert fresh Roman Urdu review
    const { data: createdReview, error: revError } = await reviewerClient
      .from("reviews")
      .insert({
        user_id: userId,
        product_id: rev.productId,
        rating: rev.rating,
        comment: rev.comment,
      })
      .select();

    if (revError) {
      console.error(`Error inserting review for ${rev.name}:`, revError.message);
    } else {
      console.log(`  ✓ Added 5-star Roman Urdu review for product #${rev.productId}`);
    }
  }

  console.log("\n=== STEP 3: Verifying Public Reviews Output ===");
  const { data: publicReviews, error: rpcErr } = await supabase.rpc("get_public_reviews");

  if (rpcErr) {
    console.error("RPC Error:", rpcErr.message);
  } else {
    console.log(`🎉 SUCCESS! Database now serves exactly ${publicReviews.length} customer reviews:`);
    publicReviews.forEach((r, idx) => {
      console.log(`\n#${idx + 1}: ${r.user_name} (Rating: ${r.rating}★)`);
      console.log(`   Comment: "${r.comment}"`);
    });
  }
}

seedReviews();

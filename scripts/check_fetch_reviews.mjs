import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const envContent = fs.readFileSync(".env", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const [k, ...v] = line.split("=");
  if (k && v.length) env[k.trim()] = v.join("=").trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function testFetch() {
  const { data: rpcReviews, error: rpcErr } = await supabase.rpc("get_public_reviews");
  console.log("RPC Error:", rpcErr?.message);
  console.log("RPC Reviews count:", rpcReviews?.length);
  if (rpcReviews?.length) {
    console.log("First review:", JSON.stringify(rpcReviews[0], null, 2));
  }

  // Also test direct table select as in reviewService fallback
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
  console.log("Direct select Error:", error?.message);
  console.log("Direct select count:", data?.length);
}

testFetch();

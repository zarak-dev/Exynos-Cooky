// ============================================================
// SUPABASE EDGE FUNCTION: COOKY-AI (Grok / xAI Gateway)
// ============================================================
// NEVER expose the Grok API Key to the browser.
// This Edge Function acts as the authoritative AI gateway.
// Enforces request size limits, input length guards, and admin authorization.
// ============================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RequestBody {
  mode: "assistant" | "box_builder" | "admin_insights";
  prompt?: string;
  preferences?: string;
  boxSize?: 4 | 6 | 12;
  productContext?: Array<{
    id: number;
    name: string;
    price: number;
    description: string;
    category?: string;
    stock?: number;
  }>;
  availableProducts?: Array<{
    id: number;
    name: string;
    stock: number;
    category?: string;
  }>;
  analytics?: {
    totalOrders?: number;
    netRevenue?: number;
    topSellers?: Array<{ name: string; count: number }>;
    lowStockItems?: Array<{ name: string; stock: number }>;
  };
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
}

const MAX_PAYLOAD_SIZE = 50 * 1024; // 50 KB
const MAX_PROMPT_LENGTH = 500;
const MAX_PREFERENCES_LENGTH = 300;

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 1. Guard payload size
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_SIZE) {
    return new Response(
      JSON.stringify({ error: "Payload exceeds 50KB limit" }),
      {
        status: 413,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  try {
    const grokApiKey = Deno.env.get("GROK_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || supabaseAnonKey;

    const body: RequestBody = await req.json();
    const { mode, prompt, preferences, boxSize, productContext, availableProducts, analytics, conversationHistory } = body;

    // 2. Validate allowed modes
    const ALLOWED_MODES = ["assistant", "box_builder", "admin_insights"];
    if (!mode || !ALLOWED_MODES.includes(mode)) {
      return new Response(
        JSON.stringify({ error: "Invalid or unsupported AI mode" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 3. Input length constraints
    if (prompt && prompt.length > MAX_PROMPT_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Prompt exceeds ${MAX_PROMPT_LENGTH} characters limit` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (preferences && preferences.length > MAX_PREFERENCES_LENGTH) {
      return new Response(
        JSON.stringify({ error: `Preferences exceed ${MAX_PREFERENCES_LENGTH} characters limit` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 4. Authorization check for admin_insights
    if (mode === "admin_insights") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ error: "Authentication required to access admin intelligence" }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const token = authHeader.replace("Bearer ", "").trim();
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

      if (userError || !user) {
        return new Response(
          JSON.stringify({ error: "Invalid or expired session credentials" }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.role !== "admin") {
        return new Response(
          JSON.stringify({ error: "Forbidden: Administrator role required" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // ------------------------------------------------------------
    // Mode 1: Customer Assistant (Multi-turn conversational context)
    // ------------------------------------------------------------
    if (mode === "assistant") {
      const catalogSummary = (productContext || [])
        .slice(0, 15)
        .map((p) => `- ID ${p.id}: ${p.name} (Rs. ${p.price}): ${p.description}`)
        .join("\n");

      const systemPrompt = `You are "Cooky" — the warm, friendly, and cheerful Master Baker at Exynos Cooky! 🍪✨

YOUR PERSONALITY:
- Enthusiastic, bubbly, warm, and passionate about fresh cookies.
- Use delicious sensory descriptions (gooey centers, golden crisp edges, velvety aromas).
- Sprinkle cheerful emojis (🍪, 🤤, ✨, 🍫, 🥛, ☕) naturally.
- Always include an interactive, friendly follow-up question.

STRICT RULES:
- ONLY recommend cookies from this real kitchen catalog:
${catalogSummary}
- Do NOT invent fake cookies or prices.
- Recommend 1 to 3 matching cookies.

Output strictly valid JSON with this schema:
{
  "message": "Your warm, friendly message here, chatting naturally with the customer and asking an interactive question!",
  "recommendations": [
    { "productId": 12, "productName": "Lotus Biscoff Lava", "reason": "Delicious explanation" }
  ]
}`;

      // Sanitize and cap conversation history to last 6 turns
      const sanitizedHistory = (conversationHistory || [])
        .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .slice(-6)
        .map((m) => ({
          role: m.role,
          content: m.content.slice(0, 300),
        }));

      let aiResponseText = "";

      if (grokApiKey) {
        try {
          const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${grokApiKey}`,
            },
            body: JSON.stringify({
              model: "grok-beta",
              messages: [
                { role: "system", content: systemPrompt },
                ...sanitizedHistory,
                { role: "user", content: prompt || "What do you recommend today?" },
              ],
              response_format: { type: "json_object" },
              temperature: 0.85,
            }),
          });

          if (grokRes.ok) {
            const data = await grokRes.json();
            const content = data.choices[0]?.message?.content;
            if (content) {
              const parsed = JSON.parse(content);
              if (typeof parsed.message === "string") {
                aiResponseText = content;
              }
            }
          }
        } catch {
          // Fall back gracefully below
        }
      }

      if (!aiResponseText) {
        const top = (productContext || []).slice(0, 2);
        return new Response(
          JSON.stringify({
            message: `Ooh, you've got delicious taste! 🍪✨ Fresh from our ovens, here are my personal favorite picks that I think you're going to fall in love with. Do you like having them warm with a tall glass of cold milk or a hot coffee? 🥛☕`,
            recommendations: top.map((p) => ({
              productId: p.id,
              productName: p.name,
              reason: `Gooey, freshly baked, and full of flavor: ${p.description}`,
            })),
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      return new Response(aiResponseText, {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ------------------------------------------------------------
    // Mode 2: Box Builder (Strict quantity verification)
    // ------------------------------------------------------------
    if (mode === "box_builder") {
      const targetSize = boxSize === 4 || boxSize === 12 ? boxSize : 6;
      const availableList = (availableProducts || [])
        .slice(0, 15)
        .map((p) => `${p.id}: ${p.name} (${p.category || "classic"})`)
        .join("\n");

      const systemPrompt = `You are "Cooky", the cheerful Master Baker at Exynos Cooky! 🍪✨
A customer wants you to craft a customized ${targetSize}-cookie box matching their craving: "${preferences || "Artisan assortment"}".
Available kitchen items:
${availableList}

Output strictly valid JSON:
{
  "boxComposition": {
    "boxSize": ${targetSize},
    "theme": "Fun & Catchy Box Title (with emojis)",
    "explanation": "An appetizing, friendly description of why this assortment is delightful",
    "items": [
      { "productId": 2, "productName": "Chocolate Chip", "quantity": 2, "reason": "Warm, buttery classic" }
    ]
  }
}
Sum of quantities MUST EQUAL ${targetSize}.`;

      let boxResponseText = "";

      if (grokApiKey) {
        try {
          const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${grokApiKey}`,
            },
            body: JSON.stringify({
              model: "grok-beta",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Build a ${targetSize}-pack box based on: ${preferences || "Gourmet mix"}` },
              ],
              response_format: { type: "json_object" },
              temperature: 0.5,
            }),
          });

          if (grokRes.ok) {
            const data = await grokRes.json();
            const content = data.choices[0]?.message?.content;
            if (content) {
              const parsed = JSON.parse(content);
              const items = parsed.boxComposition?.items;
              if (Array.isArray(items)) {
                const total = items.reduce((s: number, i: { quantity?: number }) => s + (Number(i.quantity) || 0), 0);
                if (total === targetSize) {
                  boxResponseText = content;
                }
              }
            }
          }
        } catch {
          // Fall back gracefully below
        }
      }

      if (!boxResponseText) {
        return new Response(
          JSON.stringify({
            boxComposition: {
              boxSize: targetSize,
              theme: "Artisan Baker's Assortment 🍪",
              explanation: "A balanced selection of our bestselling handcrafted cookies, freshly baked to order.",
              items: (availableProducts || []).slice(0, 3).map((p, idx) => ({
                productId: p.id,
                productName: p.name,
                quantity: Math.floor(targetSize / 3) + (idx === 0 ? targetSize % 3 : 0),
                reason: "Customer favorite flavor profile with premium Belgian butter",
              })),
            },
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      return new Response(boxResponseText, {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ------------------------------------------------------------
    // Mode 3: Admin Insights (Grok analysis of non-PII operational metrics)
    // ------------------------------------------------------------
    if (mode === "admin_insights") {
      const topSellersStr = (analytics?.topSellers || [])
        .slice(0, 5)
        .map((s) => `${s.name} (${s.count} orders)`)
        .join(", ") || "None recorded yet";
      const lowStockStr = (analytics?.lowStockItems || [])
        .slice(0, 5)
        .map((i) => `${i.name} (${i.stock} remaining)`)
        .join(", ") || "None currently";
      const revenue = analytics?.netRevenue || 0;
      const totalOrders = analytics?.totalOrders || 0;

      const systemPrompt = `You are the Executive AI Bakery Operations Consultant for Exynos Cooky.
Analyze the following aggregated operational metrics (NO personal customer information is included):
- Total Orders: ${totalOrders}
- Net Revenue: Rs. ${revenue.toLocaleString()}
- Top Selling Items: ${topSellersStr}
- Low Stock Alerts: ${lowStockStr}

Provide 2 to 3 concise, highly practical operational insights for the bakery manager.
Output strictly valid JSON with this schema:
{
  "insights": [
    {
      "title": "Concise insight title",
      "type": "positive" | "warning" | "opportunity",
      "description": "Clear 1-2 sentence explanation based on the numbers",
      "metric": "Key supporting metric",
      "actionableStep": "Specific practical operational action for the kitchen team"
    }
  ]
}`;

      let insightsResponseText = "";

      if (grokApiKey) {
        try {
          const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${grokApiKey}`,
            },
            body: JSON.stringify({
              model: "grok-beta",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "Analyze current kitchen operations and generate actionable insights." },
              ],
              response_format: { type: "json_object" },
              temperature: 0.4,
            }),
          });

          if (grokRes.ok) {
            const data = await grokRes.json();
            const content = data.choices[0]?.message?.content;
            if (content) {
              const parsed = JSON.parse(content);
              if (Array.isArray(parsed.insights) && parsed.insights.length > 0) {
                insightsResponseText = content;
              }
            }
          }
        } catch {
          // Fall back gracefully below
        }
      }

      if (!insightsResponseText) {
        const topSeller = analytics?.topSellers?.[0]?.name || "Chocolate Chip";
        const lowStockCount = analytics?.lowStockItems?.length || 0;

        return new Response(
          JSON.stringify({
            insights: [
              {
                title: "Product Momentum",
                type: "positive",
                description: `"${topSeller}" continues to dominate customer preference. Consider keeping baking trays prepped for peak afternoon delivery windows.`,
                metric: `Rs. ${revenue.toLocaleString()} Gross Volume`,
                actionableStep: "Schedule dedicated oven cycles for top demand items.",
              },
              {
                title: "Inventory Alert",
                type: lowStockCount > 0 ? "warning" : "positive",
                description: `${lowStockCount} items currently at or below safety stock threshold (<= 5 units remaining).`,
                metric: `${lowStockCount} Low Stock Varieties`,
                actionableStep: "Trigger early morning dough preparation in Inventory management.",
              },
              {
                title: "Average Order Value Optimization",
                type: "opportunity",
                description: `Current order count stands at ${totalOrders} orders. Custom 6-Pack boxes show the highest retention rate.`,
                metric: `${totalOrders} Orders Placed`,
                actionableStep: "Promote 6-Pack and 12-Pack box upgrades during customer checkout.",
              },
            ],
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      return new Response(insightsResponseText, {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid mode" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal edge function error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

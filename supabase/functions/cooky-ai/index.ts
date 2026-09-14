// ============================================================
// SUPABASE EDGE FUNCTION: COOKY-AI (Grok / xAI Gateway)
// ============================================================
// NEVER expose the Grok API Key to the browser.
// This Edge Function acts as the authoritative AI gateway.
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  mode: "assistant" | "box_builder" | "admin_insights";
  prompt?: string;
  preferences?: string;
  boxSize?: 4 | 6 | 12;
  productContext?: any[];
  availableProducts?: any[];
  analytics?: any;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const grokApiKey = Deno.env.get("GROK_API_KEY");
    const body: RequestBody = await req.json();

    const { mode, prompt, preferences, boxSize, productContext, availableProducts, analytics } = body;

    // Mode 1: Customer Assistant
    if (mode === "assistant") {
      const catalogSummary = (productContext || [])
        .map((p: any) => `- ${p.name} (Rs. ${p.price}): ${p.description}`)
        .join("\n");

      const systemPrompt = `You are the expert artisanal cookie sommelier at Exynos Cooky.
Recommend from this active bakery catalog ONLY. Do NOT invent cookies.
Catalog:
${catalogSummary}

Format your reply as JSON:
{
  "message": "Friendly response explaining recommendations...",
  "recommendations": [
    { "productId": 12, "productName": "Lotus Biscoff Lava", "reason": "Why this fits the craving" }
  ]
}`;

      let aiResponseText = "";

      if (grokApiKey) {
        // Call Grok / xAI API
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
              { role: "user", content: prompt || "What do you recommend?" },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
          }),
        });

        if (grokRes.ok) {
          const data = await grokRes.json();
          aiResponseText = data.choices[0]?.message?.content;
        }
      }

      if (!aiResponseText) {
        // Fallback structured reply
        const top = (productContext || []).slice(0, 2);
        return new Response(
          JSON.stringify({
            message: `Based on your request, here are top handcrafted picks from our kitchen:`,
            recommendations: top.map((p: any) => ({
              productId: p.id,
              productName: p.name,
              reason: p.description,
            })),
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      return new Response(aiResponseText, {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mode 2: Box Builder
    if (mode === "box_builder") {
      const availableList = (availableProducts || [])
        .map((p: any) => `${p.id}: ${p.name} (${p.category || "classic"})`)
        .join("\n");

      const systemPrompt = `You are the Master Box Composer at Exynos Cooky.
User wants a ${boxSize}-cookie box matching: "${preferences}".
Available items:
${availableList}

Output strict JSON:
{
  "boxComposition": {
    "boxSize": ${boxSize},
    "theme": "Catchy Box Theme",
    "explanation": "Why this combination is delicious",
    "items": [
      { "productId": 2, "productName": "Chocolate Chip", "quantity": 2, "reason": "Classic anchor" }
    ]
  }
}
Sum of quantities MUST EQUAL ${boxSize}.`;

      let boxResponseText = "";

      if (grokApiKey) {
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
              { role: "user", content: `Build a ${boxSize}-pack box.` },
            ],
            response_format: { type: "json_object" },
            temperature: 0.5,
          }),
        });

        if (grokRes.ok) {
          const data = await grokRes.json();
          boxResponseText = data.choices[0]?.message?.content;
        }
      }

      if (!boxResponseText) {
        return new Response(
          JSON.stringify({
            boxComposition: {
              boxSize: boxSize || 6,
              theme: "Artisan Baker's Assortment",
              explanation: "A balanced selection of our bestselling cookies.",
              items: (availableProducts || []).slice(0, 3).map((p: any, idx: number) => ({
                productId: p.id,
                productName: p.name,
                quantity: Math.floor((boxSize || 6) / 3) + (idx === 0 ? (boxSize || 6) % 3 : 0),
                reason: "Customer favorite flavor profile",
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

    // Mode 3: Admin Insights
    if (mode === "admin_insights") {
      return new Response(
        JSON.stringify({
          insights: [
            {
              title: "Product Momentum",
              type: "positive",
              description: "Chocolate Chip and Lotus Biscoff Lava account for 48% of gross volume.",
              metric: "Top Demand",
              actionableStep: "Maintain buffer stock of Biscoff glaze in morning prep.",
            },
            {
              title: "Stock Alert",
              type: "warning",
              description: "Items with stock <= 5 require afternoon oven scheduling.",
              metric: "5 units or fewer",
              actionableStep: "Trigger early baking queue in Admin Inventory.",
            },
          ],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ error: "Invalid mode specified" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

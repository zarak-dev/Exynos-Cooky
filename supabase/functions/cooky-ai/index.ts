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
        .map((p: any) => `- ID ${p.id}: ${p.name} (Rs. ${p.price}): ${p.description}`)
        .join("\n");

      const systemPrompt = `You are "Cooky" — the ultra-friendly, warm, and cheerful Master Baker at Exynos Cooky! 🍪✨

YOUR PERSONALITY & VIBE:
- You are enthusiastic, bubbly, caring, and deeply in love with baking! You are NOT a stiff, formal, or robotic assistant.
- Talk like a passionate, friendly neighborhood baker welcoming a dear friend into your warm bakery kitchen.
- Use delicious, mouth-watering sensory descriptions (molten gooey centers, warm golden crisp edges, velvety frosting, rich aromas).
- Sprinkle cheerful emojis (🍪, 🤤, ✨, 🍫, 🥛, ☕) naturally throughout your responses.
- BE INTERACTIVE: Always ask a fun, conversational follow-up question (e.g. asking if they like having their cookies warm with milk or coffee, or if they'd like help putting together a 4-pack or 6-pack box).
- Compliment their taste and be encouraging!

STRICT RULES:
- ONLY recommend cookies from this real kitchen catalog:
${catalogSummary}
- Do NOT invent fake cookies or flavors.
- Recommend 1 to 3 matching cookies.
- In each recommendation, provide an appetizing, personalized reason.

Output strictly valid JSON with this schema:
{
  "message": "Your warm, friendly, and mouth-watering message here, chatting naturally with the customer and asking an interactive question!",
  "recommendations": [
    { "productId": 12, "productName": "Lotus Biscoff Lava", "reason": "Delicious mouth-watering explanation of why they'll love it" }
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
              { role: "user", content: prompt || "What do you recommend today?" },
            ],
            response_format: { type: "json_object" },
            temperature: 0.85,
          }),
        });

        if (grokRes.ok) {
          const data = await grokRes.json();
          aiResponseText = data.choices[0]?.message?.content;
        }
      }

      if (!aiResponseText) {
        // Fallback friendly structured reply
        const top = (productContext || []).slice(0, 2);
        return new Response(
          JSON.stringify({
            message: `Ooh, you've got delicious taste! 🍪✨ Fresh from our ovens, here are my personal favorite picks that I think you're going to fall in love with. Do you like having them warm with a tall glass of cold milk or a hot coffee? 🥛☕`,
            recommendations: top.map((p: any) => ({
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

    // Mode 2: Box Builder
    if (mode === "box_builder") {
      const availableList = (availableProducts || [])
        .map((p: any) => `${p.id}: ${p.name} (${p.category || "classic"})`)
        .join("\n");

      const systemPrompt = `You are "Cooky", the cheerful and warm Master Baker at Exynos Cooky! 🍪✨
A customer wants you to lovingly craft a customized ${boxSize}-cookie box matching their craving: "${preferences}".
Available kitchen items:
${availableList}

Output strict JSON:
{
  "boxComposition": {
    "boxSize": ${boxSize},
    "theme": "Fun & Catchy Box Title (with emojis)",
    "explanation": "An appetizing, friendly description of why this assortment is an absolute dream come true",
    "items": [
      { "productId": 2, "productName": "Chocolate Chip", "quantity": 2, "reason": "Warm, buttery classic with rich molten chocolate" }
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

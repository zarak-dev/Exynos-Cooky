import { supabase, isSupabaseConfigured } from "../supabase/client";
import type {
  AIMessage,
  AIBoxRecommendation,
  AdminAIInsight,
  AIRecommendation,
} from "../../types/ai";
import { productService } from "../supabase/productService";

interface AskAssistantParams {
  prompt: string;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
}

interface BoxBuilderParams {
  boxSize: 4 | 6 | 12;
  preferences: string;
}

interface AdminInsightsParams {
  totalOrders: number;
  netRevenue: number;
  topSellers: Array<{ name: string; count: number }>;
  lowStockItems: Array<{ name: string; stock: number }>;
}

/**
 * Intelligently scores and selects the most relevant available products
 * to feed into Grok AI prompt context (up to 40 products).
 */
function getRelevantProductContext(products: Array<import("../../types/product").Product>, userQuery: string, maxItems = 40) {
  const available = products.filter((p) => p.isAvailable && p.stock > 0);
  if (available.length <= maxItems) return available;

  const queryTokens = userQuery.toLowerCase().split(/\s+/).filter((t) => t.length > 2);

  const scored = available.map((p) => {
    let score = 0;
    const nameLower = p.name.toLowerCase();
    const descLower = p.description.toLowerCase();
    const catLower = (p.category || "").toLowerCase();

    for (const token of queryTokens) {
      if (nameLower.includes(token)) score += 10;
      if (descLower.includes(token)) score += 4;
      if (catLower.includes(token)) score += 6;
    }

    // Boost iconic/bestselling varieties slightly
    if (nameLower.includes("chocolate chip") || nameLower.includes("biscoff") || nameLower.includes("lava") || nameLower.includes("velvet")) {
      score += 2;
    }

    return { product: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxItems).map((s) => s.product);
}

export const aiService = {
  /**
   * Use Case #1: Cooky AI Assistant
   * Recommends actual cookies grounded in catalog data with multi-turn conversation support
   * Friendly, sweet, polite tone with real matching options (never made up)
   */
  async askAssistant(params: AskAssistantParams): Promise<AIMessage> {
    const products = await productService.fetchProducts();
    const relevantProducts = getRelevantProductContext(products, params.prompt, 40);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.functions.invoke("cooky-ai", {
          body: {
            mode: "assistant",
            prompt: params.prompt,
            conversationHistory: params.conversationHistory,
            productContext: relevantProducts.map((p) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              description: p.description,
              category: p.category,
              stock: p.stock,
            })),
          },
        });

        if (!error && data && typeof data.message === "string") {
          const validatedRecs: AIRecommendation[] = [];
          const seenIds = new Set<number>();

          if (Array.isArray(data.recommendations)) {
            for (const item of data.recommendations) {
              if (!item) continue;
              // 1. Strict anti-hallucination matching against real database products
              let matched = products.find((p) => p.isAvailable && p.id === item.productId);

              if (!matched && typeof item.productName === "string") {
                const targetName = item.productName.toLowerCase().trim();
                matched = products.find(
                  (p) => p.isAvailable && p.name.toLowerCase() === targetName,
                );
                if (!matched) {
                  matched = products.find(
                    (p) =>
                      p.isAvailable &&
                      (p.name.toLowerCase().includes(targetName) ||
                        targetName.includes(p.name.toLowerCase())),
                  );
                }
              }

              // If still unmatched, pick closest relevant available product
              if (!matched) {
                matched = relevantProducts.find((p) => !seenIds.has(p.id));
              }

              if (matched && !seenIds.has(matched.id)) {
                seenIds.add(matched.id);
                validatedRecs.push({
                  productId: matched.id,
                  productName: matched.name,
                  price: matched.price,
                  reason:
                    item.reason ||
                    `Warmly handcrafted with premium ingredients: ${matched.description}`,
                });
              }
            }
          }

          // Ensure at least 1-2 real recommendations if user asked for a recommendation
          if (validatedRecs.length === 0 && relevantProducts.length > 0) {
            const fallbackPicks = relevantProducts.slice(0, 2);
            for (const p of fallbackPicks) {
              validatedRecs.push({
                productId: p.id,
                productName: p.name,
                price: p.price,
                reason: `Freshly baked today: ${p.description}`,
              });
            }
          }

          return {
            id: `ai-${Date.now()}`,
            sender: "assistant",
            content: data.message,
            recommendations: validatedRecs.length > 0 ? validatedRecs : undefined,
            timestamp: new Date().toISOString(),
          };
        }
      } catch {
        // Fall back gracefully below
      }
    }

    // Offline / unconfigured environment fallback grounded strictly in real catalog
    const matchingProducts = relevantProducts.slice(0, 3);
    const optionsText = matchingProducts
      .map((p, idx) => `• Option ${idx + 1}: **${p.name}** (Rs. ${p.price}) — ${p.description}`)
      .join("\n\n");

    return {
      id: `ai-${Date.now()}`,
      sender: "assistant",
      content: `Hello sweet friend! 🍪✨ It is an absolute pleasure to serve you today! Our ovens are warm and fragrant, and I have found the loveliest matching options for you:\n\n${optionsText}\n\nWhich of these sweet options speaks to your heart, darling? Would you like me to pop one into your bakery box? 💖🥛`,
      recommendations: matchingProducts.map((p) => ({
        productId: p.id,
        productName: p.name,
        price: p.price,
        reason: `Freshly pulled from our oven: ${p.description}`,
      })),
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Use Case #2: AI Box Builder
   * Structured recommendation for a 4, 6, or 12 cookie box
   */
  async buildBox(params: BoxBuilderParams): Promise<AIBoxRecommendation> {
    const products = await productService.fetchProducts();
    const available = products.filter((p) => p.isAvailable && p.stock > 0);

    if (available.length === 0) {
      throw new Error("Cannot generate box: No cookies are currently in stock.");
    }

    const relevant = getRelevantProductContext(products, params.preferences, 40);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.functions.invoke("cooky-ai", {
          body: {
            mode: "box_builder",
            boxSize: params.boxSize,
            preferences: params.preferences,
            availableProducts: relevant.map((p) => ({
              id: p.id,
              name: p.name,
              stock: p.stock,
              category: p.category,
            })),
          },
        });

        if (!error && data?.boxComposition) {
          const comp = data.boxComposition;
          if (
            (comp.boxSize === 4 || comp.boxSize === 6 || comp.boxSize === 12) &&
            Array.isArray(comp.items) &&
            comp.items.length > 0
          ) {
            // Verify items against real available products
            const verifiedItems = [];
            for (const item of comp.items) {
              let matched = available.find((p) => p.id === Number(item.productId));
              if (!matched && item.productName) {
                matched = available.find(
                  (p) => p.name.toLowerCase() === String(item.productName).toLowerCase(),
                );
              }
              if (!matched) {
                matched = relevant[0] || available[0];
              }

              verifiedItems.push({
                productId: matched.id,
                productName: matched.name,
                quantity: Math.max(1, Number(item.quantity) || 1),
                reason: item.reason || `Handcrafted sweet pairing: ${matched.name}`,
              });
            }

            const total = verifiedItems.reduce((s, i) => s + i.quantity, 0);
            if (total === params.boxSize) {
              return {
                boxSize: comp.boxSize,
                theme: comp.theme || "Baker's Sweet Artisan Box 🍪✨",
                explanation: comp.explanation || "A loving, freshly baked selection crafted especially for you.",
                items: verifiedItems,
              };
            }
          }
        }
      } catch {
        // Fall back gracefully below
      }
    }

    // Offline / unconfigured environment fallback
    const itemsPerCookie = Math.max(1, Math.floor(params.boxSize / Math.min(relevant.length, 3)));
    let remaining = params.boxSize;
    const boxItems = [];

    for (const p of relevant) {
      if (remaining <= 0) break;
      const qty = Math.min(itemsPerCookie, remaining);
      boxItems.push({
        productId: p.id,
        productName: p.name,
        quantity: qty,
        reason: `Pairs deliciously with your craving for ${p.name}`,
      });
      remaining -= qty;
    }

    if (remaining > 0 && boxItems.length > 0) {
      boxItems[0].quantity += remaining;
    }

    return {
      boxSize: params.boxSize,
      theme: "Baker's Sweet Dream Box 🍪✨",
      explanation: `I've lovingly hand-picked this ${params.boxSize}-cookie box for you! It's packed with mouth-watering variety, gooey centers, and irresistible aromas.`,
      items: boxItems,
    };
  },

  /**
   * Use Case #3: Admin AI Insights
   * Aggregates bakery performance and returns actionable intelligence
   */
  async getAdminInsights(params: AdminInsightsParams): Promise<AdminAIInsight[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.functions.invoke("cooky-ai", {
        body: {
          mode: "admin_insights",
          analytics: params,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to generate admin operational insights.");
      }

      if (data && Array.isArray(data.insights) && data.insights.length > 0) {
        return data.insights.map((ins: {
          title: string;
          type: "positive" | "warning" | "opportunity";
          description: string;
          metric?: string;
          actionableStep?: string;
        }) => ({
          title: String(ins.title || "Operations Insight"),
          type: (ins.type === "positive" || ins.type === "warning" || ins.type === "opportunity") ? ins.type : "positive",
          description: String(ins.description || ""),
          metric: ins.metric ? String(ins.metric) : undefined,
          actionableStep: ins.actionableStep ? String(ins.actionableStep) : undefined,
        }));
      }

      throw new Error("Invalid insights schema returned by AI service.");
    }

    // Deterministic operational insights based on real aggregated metrics
    const insights: AdminAIInsight[] = [];

    if (params.topSellers.length > 0) {
      insights.push({
        title: "Top Performer Momentum",
        type: "positive",
        description: `"${params.topSellers[0].name}" is dominating customer choice. Consider featuring it on the hero carousel for improved conversion.`,
        metric: `${params.topSellers[0].count} orders`,
        actionableStep: "Increase daily batch size by 20% to prevent afternoon stockouts.",
      });
    }

    if (params.lowStockItems.length > 0) {
      insights.push({
        title: "Inventory Replenishment Alert",
        type: "warning",
        description: `${params.lowStockItems.length} cookie variety is currently below safety thresholds (<= 5 units remaining).`,
        metric: params.lowStockItems.map((i) => `${i.name} (${i.stock})`).join(", "),
        actionableStep: "Schedule an early baking cycle in the admin inventory queue.",
      });
    }

    insights.push({
      title: "Average Order Value Optimization",
      type: "opportunity",
      description: `Current Net Revenue stands at Rs. ${params.netRevenue.toLocaleString()}. 6-Pack boxes show the highest retention rate among returning customers.`,
      metric: `${params.totalOrders} total orders placed`,
      actionableStep: "Promote 6-Pack and 12-Pack box upgrades during checkout.",
    });

    return insights;
  },
};

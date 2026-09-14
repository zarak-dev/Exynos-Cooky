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

export const aiService = {
  /**
   * Use Case #1: Cooky AI Assistant
   * Recommends actual cookies grounded in catalog data with multi-turn conversation support
   */
  async askAssistant(params: AskAssistantParams): Promise<AIMessage> {
    const products = await productService.fetchProducts();
    const availableProducts = products
      .filter((p) => p.isAvailable && p.stock > 0)
      .slice(0, 15);

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.functions.invoke("cooky-ai", {
        body: {
          mode: "assistant",
          prompt: params.prompt,
          conversationHistory: params.conversationHistory,
          productContext: availableProducts.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.description,
            category: p.category,
            stock: p.stock,
          })),
        },
      });

      if (error) {
        throw new Error(error.message || "AI assistant service encountered an error.");
      }

      if (data && typeof data.message === "string") {
        const validatedRecs: AIRecommendation[] = [];
        if (Array.isArray(data.recommendations)) {
          for (const item of data.recommendations) {
            if (item && typeof item.productId === "number" && typeof item.productName === "string") {
              validatedRecs.push({
                productId: item.productId,
                productName: item.productName,
                reason: item.reason || "Recommended by Baker Cooky",
                price: item.price ? Number(item.price) : undefined,
              });
            }
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

      throw new Error("Invalid response schema received from AI assistant.");
    }

    // Offline / unconfigured environment fallback grounded in catalog
    const query = params.prompt.toLowerCase();
    const matches = availableProducts.filter((p) => {
      const text = `${p.name} ${p.description} ${p.category}`.toLowerCase();
      if (query.includes("chocolate") || query.includes("choco")) {
        return text.includes("chocolate") || text.includes("fudge") || text.includes("mocha");
      }
      if (query.includes("velvet") || query.includes("sweet") || query.includes("cake")) {
        return text.includes("velvet") || text.includes("cream") || text.includes("sugar");
      }
      if (query.includes("biscoff") || query.includes("lotus") || query.includes("caramel")) {
        return text.includes("biscoff") || text.includes("caramel") || text.includes("lava");
      }
      return true;
    });

    const selected = (matches.length > 0 ? matches : availableProducts).slice(0, 3);

    return {
      id: `ai-${Date.now()}`,
      sender: "assistant",
      content: `Ooh, you've got incredible taste! 🍪✨ Fresh from our ovens today, here are my personal favorite treats that match what you're craving. Would you like to pair these with a tall glass of cold milk or a warm coffee? Let me know if you want me to help pack them into a box! 🥛☕`,
      recommendations: selected.map((p) => ({
        productId: p.id,
        productName: p.name,
        price: p.price,
        reason: `Freshly baked, soft & flavorful: ${p.description.slice(0, 90)}...`,
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

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.functions.invoke("cooky-ai", {
        body: {
          mode: "box_builder",
          boxSize: params.boxSize,
          preferences: params.preferences,
          availableProducts: available.map((p) => ({
            id: p.id,
            name: p.name,
            stock: p.stock,
            category: p.category,
          })),
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to generate AI box recommendation.");
      }

      const comp = data?.boxComposition;
      if (
        comp &&
        (comp.boxSize === 4 || comp.boxSize === 6 || comp.boxSize === 12) &&
        Array.isArray(comp.items) &&
        comp.items.length > 0
      ) {
        // Validate total count
        const total = comp.items.reduce(
          (sum: number, item: { quantity?: number }) => sum + (Number(item.quantity) || 0),
          0,
        );

        if (total === params.boxSize) {
          return {
            boxSize: comp.boxSize,
            theme: comp.theme || "Artisan Baker's Box 🍪",
            explanation: comp.explanation || "A curated assortment handpicked for you.",
            items: comp.items.map((item: { productId: number; productName: string; quantity: number; reason?: string }) => ({
              productId: Number(item.productId),
              productName: String(item.productName),
              quantity: Number(item.quantity),
              reason: item.reason,
            })),
          };
        }
      }

      throw new Error("AI generated an invalid box composition schema.");
    }

    // Offline / unconfigured environment fallback
    const itemsPerCookie = Math.max(1, Math.floor(params.boxSize / Math.min(available.length, 3)));
    let remaining = params.boxSize;
    const boxItems = [];

    for (const p of available) {
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

import { supabase, isSupabaseConfigured } from "./client";
import type { Product } from "../../types/product";
import { COOKIE_MOCK_DATA } from "../../utils/mockData";
import { loadFromStorage } from "../../utils/storage";

const LOCAL_STORAGE_INVENTORY_KEY = "exynos_inventory";

export const productService = {
  async fetchProducts(): Promise<Product[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (!error && data && data.length > 0) {
        const products = data.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          stock: item.stock_quantity ?? item.stock ?? 0,
          description: item.description,
          imageUrl: item.image_url ?? item.imageUrl,
          isAvailable: item.is_available ?? item.isAvailable ?? true,
          category: item.category || "classic",
        }));
        try {
          localStorage.setItem(
            LOCAL_STORAGE_INVENTORY_KEY,
            JSON.stringify(products),
          );
        } catch {
          // Ignore storage quota errors
        }
        return products;
      }
    }

    // Fallback to local storage or mock data
    return loadFromStorage<Product[]>(
      LOCAL_STORAGE_INVENTORY_KEY,
      COOKIE_MOCK_DATA,
    );
  },

  async toggleAvailability(
    id: number,
    isAvailable: boolean,
  ): Promise<{ id: number; isAvailable: boolean }> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from("products")
        .update({ is_available: isAvailable })
        .eq("id", id);

      if (error) {
        console.warn("Supabase toggle availability error:", error.message);
      }
    }

    // Update local cache
    const current = loadFromStorage<Product[]>(
      LOCAL_STORAGE_INVENTORY_KEY,
      COOKIE_MOCK_DATA,
    );
    const updated = current.map((p) =>
      p.id === id ? { ...p, isAvailable } : p,
    );
    localStorage.setItem(LOCAL_STORAGE_INVENTORY_KEY, JSON.stringify(updated));

    return { id, isAvailable };
  },

  async addProduct(newProduct: Omit<Product, "id">): Promise<Product> {
    const current = loadFromStorage<Product[]>(
      LOCAL_STORAGE_INVENTORY_KEY,
      COOKIE_MOCK_DATA,
    );
    const newId =
      current.length > 0 ? Math.max(...current.map((p) => p.id)) + 1 : 1;

    const product: Product = {
      ...newProduct,
      id: newId,
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: product.name,
          price: product.price,
          description: product.description,
          image_url: product.imageUrl,
          stock_quantity: product.stock,
          is_available: product.isAvailable,
          category: product.category || "classic",
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase addProduct error:", error.message);
      } else if (data) {
        product.id = data.id;
      }
    }

    const updated = [product, ...current];
    localStorage.setItem(LOCAL_STORAGE_INVENTORY_KEY, JSON.stringify(updated));
    return product;
  },

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from("products")
        .update({
          ...(updates.name && { name: updates.name }),
          ...(updates.price !== undefined && { price: updates.price }),
          ...(updates.stock !== undefined && { stock_quantity: updates.stock }),
          ...(updates.description && { description: updates.description }),
          ...(updates.imageUrl && { image_url: updates.imageUrl }),
          ...(updates.isAvailable !== undefined && {
            is_available: updates.isAvailable,
          }),
        })
        .eq("id", id);

      if (error) {
        console.error("Supabase updateProduct error:", error.message);
      }
    }

    const current = loadFromStorage<Product[]>(
      LOCAL_STORAGE_INVENTORY_KEY,
      COOKIE_MOCK_DATA,
    );
    const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
    localStorage.setItem(LOCAL_STORAGE_INVENTORY_KEY, JSON.stringify(updated));

    const target = updated.find((p) => p.id === id);
    if (!target) throw new Error("Product not found");
    return target;
  },

  async deleteProduct(id: number): Promise<number> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        console.error("Supabase deleteProduct error:", error.message);
      }
    }

    const current = loadFromStorage<Product[]>(
      LOCAL_STORAGE_INVENTORY_KEY,
      COOKIE_MOCK_DATA,
    );
    const updated = current.filter((p) => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_INVENTORY_KEY, JSON.stringify(updated));
    return id;
  },
};

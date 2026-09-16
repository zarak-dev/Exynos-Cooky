import { supabase, isSupabaseConfigured } from "./client";
import type { Product } from "@src/types/product";

export const productService = {
  async fetchProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot load products.");
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      throw new Error(`Failed to load products: ${error.message}`);
    }

    return (data || []).map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      stock: item.stock_quantity ?? item.stock ?? 0,
      description: item.description,
      imageUrl: item.image_url ?? item.imageUrl,
      isAvailable: item.is_available ?? item.isAvailable ?? true,
      category: item.category || "classic",
    }));
  },

  async toggleAvailability(
    id: number,
    isAvailable: boolean,
  ): Promise<{ id: number; isAvailable: boolean }> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot update availability.");
    }

    const { error } = await supabase
      .from("products")
      .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to toggle availability: ${error.message}`);
    }

    return { id, isAvailable };
  },

  async addProduct(newProduct: Omit<Product, "id">): Promise<Product> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot add product.");
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        image_url: newProduct.imageUrl,
        stock_quantity: newProduct.stock,
        is_available: newProduct.isAvailable,
        category: newProduct.category || "classic",
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add product: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      price: Number(data.price),
      stock: data.stock_quantity,
      description: data.description,
      imageUrl: data.image_url,
      isAvailable: data.is_available,
      category: data.category,
    };
  },

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot update product.");
    }

    const { data, error } = await supabase
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
        ...(updates.category && { category: updates.category }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      price: Number(data.price),
      stock: data.stock_quantity,
      description: data.description,
      imageUrl: data.image_url,
      isAvailable: data.is_available,
      category: data.category,
    };
  },

  async deleteProduct(id: number): Promise<number> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot delete product.");
    }

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }

    return id;
  },
};

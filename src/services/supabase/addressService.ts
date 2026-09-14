import { supabase, isSupabaseConfigured } from "./client";
import type { Address, AddressInput } from "../../types/address";

export const addressService = {
  async fetchAddresses(userId: string): Promise<Address[]> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot load addresses.");
    }

    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false });

    if (error) {
      throw new Error(`Failed to load addresses: ${error.message}`);
    }

    return (data || []).map((item) => ({
      id: item.id,
      userId: item.user_id,
      recipientName: item.recipient_name,
      phone: item.phone,
      addressLine1: item.address_line1,
      addressLine2: item.address_line2,
      city: item.city,
      state: item.state,
      postalCode: item.postal_code,
      isDefault: item.is_default,
      createdAt: item.created_at,
    }));
  },

  async addAddress(input: AddressInput, userId: string): Promise<Address> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot add address.");
    }

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id: userId,
        recipient_name: input.recipientName,
        phone: input.phone,
        address_line1: input.addressLine1,
        address_line2: input.addressLine2 || "",
        city: input.city,
        state: input.state || "",
        postal_code: input.postalCode || "",
        is_default: input.isDefault,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save address: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      recipientName: data.recipient_name,
      phone: data.phone,
      addressLine1: data.address_line1,
      addressLine2: data.address_line2,
      city: data.city,
      state: data.state,
      postalCode: data.postal_code,
      isDefault: data.is_default,
      createdAt: data.created_at,
    };
  },

  async deleteAddress(id: string): Promise<string> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot delete address.");
    }

    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) {
      throw new Error(`Failed to delete address: ${error.message}`);
    }

    return id;
  },

  async setDefaultAddress(id: string, userId: string): Promise<Address[]> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot update default address.");
    }

    const { error: resetError } = await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", userId);

    if (resetError) {
      throw new Error(`Failed to reset default address: ${resetError.message}`);
    }

    const { error: setError } = await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id);

    if (setError) {
      throw new Error(`Failed to set default address: ${setError.message}`);
    }

    return this.fetchAddresses(userId);
  },
};

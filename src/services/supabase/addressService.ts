import { supabase, isSupabaseConfigured } from "./client";
import type { Address, AddressInput } from "../../types/address";
import { loadFromStorage } from "../../utils/storage";

const LOCAL_STORAGE_ADDRESS_KEY = "exynos_user_addresses";

export const addressService = {
  async fetchAddresses(userId: string): Promise<Address[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false });

      if (!error && data) {
        return data.map((item) => ({
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
      }
    }

    const localList = loadFromStorage<Address[]>(LOCAL_STORAGE_ADDRESS_KEY, []);
    return localList.filter((a) => a.userId === userId);
  },

  async addAddress(input: AddressInput, userId: string): Promise<Address> {
    const newAddress: Address = {
      ...input,
      id: `addr-${Date.now()}`,
      userId,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
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

      if (!error && data) {
        newAddress.id = data.id;
      }
    }

    const current = loadFromStorage<Address[]>(LOCAL_STORAGE_ADDRESS_KEY, []);
    const updated = [newAddress, ...current];
    localStorage.setItem(LOCAL_STORAGE_ADDRESS_KEY, JSON.stringify(updated));
    return newAddress;
  },

  async deleteAddress(id: string): Promise<string> {
    if (isSupabaseConfigured) {
      await supabase.from("addresses").delete().eq("id", id);
    }

    const current = loadFromStorage<Address[]>(LOCAL_STORAGE_ADDRESS_KEY, []);
    const updated = current.filter((a) => a.id !== id);
    localStorage.setItem(LOCAL_STORAGE_ADDRESS_KEY, JSON.stringify(updated));
    return id;
  },

  async setDefaultAddress(id: string, userId: string): Promise<Address[]> {
    if (isSupabaseConfigured) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", userId);

      await supabase
        .from("addresses")
        .update({ is_default: true })
        .eq("id", id);
    }

    const current = loadFromStorage<Address[]>(LOCAL_STORAGE_ADDRESS_KEY, []);
    const updated = current.map((a) =>
      a.userId === userId ? { ...a, isDefault: a.id === id } : a,
    );
    localStorage.setItem(LOCAL_STORAGE_ADDRESS_KEY, JSON.stringify(updated));
    return updated.filter((a) => a.userId === userId);
  },
};

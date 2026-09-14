import { supabase, isSupabaseConfigured } from "./client";
import type { Order, OrderStatus } from "../../types/order";
import { loadFromStorage } from "../../utils/storage";

const LOCAL_STORAGE_ORDERS_KEY = "exynos_orders";

export const orderService = {
  async fetchOrders(userEmail?: string): Promise<Order[]> {
    if (isSupabaseConfigured) {
      let query = supabase
        .from("orders")
        .select(`*, order_items(*)`)
        .order("created_at", { ascending: false });

      if (userEmail) {
        query = query.eq("customer_email", userEmail);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((row) => ({
          id: row.id,
          userId: row.user_id,
          customerName: row.customer_name,
          customerEmail: row.customer_email,
          customerPhone: row.customer_phone,
          deliveryAddress: row.delivery_address,
          boxSize: row.box_size,
          contents: row.contents,
          subtotal: Number(row.subtotal) || 0,
          deliveryFee: Number(row.delivery_fee) || 0,
          discount: Number(row.discount) || 0,
          totalPrice: Number(row.total_price) || 0,
          paymentMethod: row.payment_method || "cod",
          paymentStatus: row.payment_status || "pending",
          status: row.status as OrderStatus,
          timestamp: row.timestamp || row.created_at,
          items: (row.order_items || []).map(
            (item: {
              id?: string;
              product_id: number;
              product_name_snapshot: string;
              unit_price: number | string;
              quantity: number;
              subtotal: number | string;
            }) => ({
              id: item.id,
              productId: item.product_id,
              productNameSnapshot: item.product_name_snapshot,
              unitPrice: Number(item.unit_price),
              quantity: item.quantity,
              subtotal: Number(item.subtotal),
            }),
          ),
        }));
      }
    }

    // Fallback to local storage
    const localOrders = loadFromStorage<Order[]>(LOCAL_STORAGE_ORDERS_KEY, []);
    if (userEmail) {
      return localOrders.filter(
        (o) => o.customerEmail.toLowerCase() === userEmail.toLowerCase(),
      );
    }
    return localOrders;
  },

  async createOrder(newOrder: Order): Promise<Order> {
    if (isSupabaseConfigured) {
      const { error: orderError } = await supabase.from("orders").insert({
        id: newOrder.id,
        customer_name: newOrder.customerName,
        customer_email: newOrder.customerEmail,
        customer_phone: newOrder.customerPhone || "",
        delivery_address: newOrder.deliveryAddress || "",
        box_size: newOrder.boxSize,
        contents: newOrder.contents,
        subtotal: newOrder.subtotal ?? newOrder.totalPrice,
        delivery_fee: newOrder.deliveryFee ?? 0,
        discount: newOrder.discount ?? 0,
        total_price: newOrder.totalPrice,
        payment_method: newOrder.paymentMethod || "cod",
        payment_status: newOrder.paymentStatus || "pending",
        status: newOrder.status,
        timestamp: newOrder.timestamp,
      });

      if (orderError) {
        console.warn("Supabase createOrder notice:", orderError.message);
      } else if (newOrder.items && newOrder.items.length > 0) {
        // Insert order items
        await supabase.from("order_items").insert(
          newOrder.items.map((item) => ({
            order_id: newOrder.id,
            product_id: item.productId,
            product_name_snapshot: item.productNameSnapshot,
            unit_price: item.unitPrice,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })),
        );
      }
    }

    // Persist to local cache
    const current = loadFromStorage<Order[]>(LOCAL_STORAGE_ORDERS_KEY, []);
    const updated = [newOrder, ...current];
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
    return newOrder;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<{ id: string; status: OrderStatus }> {
    if (isSupabaseConfigured) {
      await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
    }

    const current = loadFromStorage<Order[]>(LOCAL_STORAGE_ORDERS_KEY, []);
    const updated = current.map((order) =>
      order.id === id ? { ...order, status } : order,
    );
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
    return { id, status };
  },

  async deleteOrder(id: string): Promise<string> {
    if (isSupabaseConfigured) {
      await supabase.from("orders").delete().eq("id", id);
    }

    const current = loadFromStorage<Order[]>(LOCAL_STORAGE_ORDERS_KEY, []);
    const updated = current.filter((order) => order.id !== id);
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
    return id;
  },
};

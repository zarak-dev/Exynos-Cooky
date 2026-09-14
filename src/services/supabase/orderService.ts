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
      // 1. Try atomic RPC with stock validation & decrement
      const itemsPayload = (newOrder.items || []).map((item) => ({
        product_id: item.productId,
        product_name_snapshot: item.productNameSnapshot,
        unit_price: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.subtotal,
      }));

      const { error: rpcError } = await supabase.rpc("create_order_with_items", {
        order_data: {
          id: newOrder.id,
          user_id: newOrder.userId || null,
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
        },
        items_data: itemsPayload,
      });

      // If RPC succeeded, cache locally and return
      if (!rpcError) {
        const current = loadFromStorage<Order[]>(LOCAL_STORAGE_ORDERS_KEY, []);
        const updated = [newOrder, ...current];
        localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
        return newOrder;
      }

      // If RPC is missing in remote DB, fallback to direct insert with strict error checking
      if (rpcError.message?.includes("function") && rpcError.message?.includes("does not exist")) {
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
          throw new Error(`Order placement failed: ${orderError.message}`);
        }

        if (newOrder.items && newOrder.items.length > 0) {
          const { error: itemsError } = await supabase.from("order_items").insert(
            newOrder.items.map((item) => ({
              order_id: newOrder.id,
              product_id: item.productId,
              product_name_snapshot: item.productNameSnapshot,
              unit_price: item.unitPrice,
              quantity: item.quantity,
              subtotal: item.subtotal,
            })),
          );

          if (itemsError) {
            console.warn("Could not save order items:", itemsError.message);
          }
        }
      } else {
        // Business logic error from RPC (e.g. out of stock or sold out)
        throw new Error(rpcError.message || "Failed to create order");
      }
    }

    // Persist to local cache
    const current = loadFromStorage<Order[]>(LOCAL_STORAGE_ORDERS_KEY, []);
    const updated = [newOrder, ...current];
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
    return newOrder;
  },

  async trackOrder(orderId: string): Promise<Order | null> {
    const cleanId = orderId.trim();
    if (!cleanId) return null;

    if (isSupabaseConfigured) {
      // Try secure RPC first
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        "track_order_by_id",
        { target_order_id: cleanId },
      );

      if (!rpcError && rpcData) {
        return rpcData as Order;
      }

      // Fallback to direct query
      const { data, error } = await supabase
        .from("orders")
        .select(`*, order_items(*)`)
        .ilike("id", cleanId)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          customerName: data.customer_name,
          customerEmail: data.customer_email,
          customerPhone: data.customer_phone,
          deliveryAddress: data.delivery_address,
          boxSize: data.box_size,
          contents: data.contents,
          subtotal: Number(data.subtotal) || 0,
          deliveryFee: Number(data.delivery_fee) || 0,
          discount: Number(data.discount) || 0,
          totalPrice: Number(data.total_price) || 0,
          paymentMethod: data.payment_method || "cod",
          paymentStatus: data.payment_status || "pending",
          status: data.status as OrderStatus,
          timestamp: data.timestamp || data.created_at,
          items: (data.order_items || []).map(
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
        };
      }
    }

    // Fallback to local storage
    const localOrders = loadFromStorage<Order[]>(LOCAL_STORAGE_ORDERS_KEY, []);
    return (
      localOrders.find((o) => o.id.toUpperCase() === cleanId.toUpperCase()) ||
      null
    );
  },

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
  ): Promise<{ id: string; status: OrderStatus }> {
    if (isSupabaseConfigured) {
      if (status === "Cancelled") {
        const { error: cancelError } = await supabase.rpc(
          "cancel_order_and_restore_stock",
          { target_order_id: id },
        );
        if (cancelError && !cancelError.message?.includes("does not exist")) {
          throw new Error(cancelError.message);
        }
      }

      const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
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
      // First attempt cancellation with stock restore if applicable
      await supabase.rpc("cancel_order_and_restore_stock", { target_order_id: id });
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
    }

    const current = loadFromStorage<Order[]>(LOCAL_STORAGE_ORDERS_KEY, []);
    const updated = current.filter((order) => order.id !== id);
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(updated));
    return id;
  },
};

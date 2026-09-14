import { supabase, isSupabaseConfigured } from "./client";
import type { Order, OrderStatus } from "../../types/order";

export const orderService = {
  async fetchOrders(userEmail?: string): Promise<Order[]> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot load orders.");
    }

    let query = supabase
      .from("orders")
      .select(`*, order_items(*)`)
      .order("created_at", { ascending: false });

    if (userEmail) {
      query = query.eq("customer_email", userEmail.trim());
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Failed to load orders: ${error.message}`);
    }

    return (data || []).map((row) => ({
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
  },

  async createOrder(
    newOrder: Order,
    couponCode?: string,
  ): Promise<Order> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot place order.");
    }

    // Submit intent ONLY: product IDs and quantities.
    // Never trust client prices, delivery fees, or discounts.
    const itemsPayload = (newOrder.items || []).map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    }));

    const { data, error } = await supabase.rpc("create_order_with_items", {
      order_data: {
        id: newOrder.id,
        user_id: newOrder.userId || null,
        customer_name: newOrder.customerName,
        customer_email: newOrder.customerEmail,
        customer_phone: newOrder.customerPhone || "",
        delivery_address: newOrder.deliveryAddress || "",
        box_size: newOrder.boxSize,
        contents: newOrder.contents,
        payment_method: newOrder.paymentMethod || "cod",
      },
      items_data: itemsPayload,
      coupon_code: couponCode || newOrder.couponCode || null,
    });

    if (error) {
      throw new Error(error.message || "Failed to create order");
    }

    if (!data) {
      throw new Error("Order creation failed: No record returned from server.");
    }

    // Return the authoritative order record calculated and stored in Supabase
    return {
      id: data.id,
      userId: data.userId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryAddress,
      boxSize: data.boxSize,
      contents: data.contents,
      subtotal: Number(data.subtotal) || 0,
      deliveryFee: Number(data.deliveryFee) || 0,
      discount: Number(data.discount) || 0,
      totalPrice: Number(data.totalPrice) || 0,
      paymentMethod: data.paymentMethod || "cod",
      paymentStatus: data.paymentStatus || "pending",
      status: data.status as OrderStatus,
      timestamp: data.timestamp,
      items: (data.items || []).map(
        (item: {
          product_id: number;
          product_name_snapshot: string;
          unit_price: number | string;
          quantity: number;
          subtotal: number | string;
        }) => ({
          productId: item.product_id,
          productNameSnapshot: item.product_name_snapshot,
          unitPrice: Number(item.unit_price),
          quantity: item.quantity,
          subtotal: Number(item.subtotal),
        }),
      ),
    };
  },

  async trackOrder(orderId: string): Promise<Order | null> {
    const cleanId = orderId.trim();
    if (!cleanId) return null;

    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Live tracking unavailable.");
    }

    const { data, error } = await supabase.rpc("track_order_by_id", {
      target_order_id: cleanId,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.userId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryAddress,
      boxSize: data.boxSize,
      contents: data.contents,
      subtotal: Number(data.subtotal) || 0,
      deliveryFee: Number(data.deliveryFee) || 0,
      discount: Number(data.discount) || 0,
      totalPrice: Number(data.totalPrice) || 0,
      paymentMethod: data.paymentMethod || "cod",
      paymentStatus: data.paymentStatus || "pending",
      status: data.status as OrderStatus,
      timestamp: data.timestamp,
      items: (data.items || []).map(
        (item: {
          id?: string;
          productId: number;
          productNameSnapshot: string;
          unitPrice: number | string;
          quantity: number;
          subtotal: number | string;
        }) => ({
          id: item.id,
          productId: item.productId,
          productNameSnapshot: item.productNameSnapshot,
          unitPrice: Number(item.unitPrice),
          quantity: item.quantity,
          subtotal: Number(item.subtotal),
        }),
      ),
    };
  },

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
  ): Promise<{ id: string; status: OrderStatus }> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot update status.");
    }

    if (status === "Cancelled") {
      const { error: cancelError } = await supabase.rpc(
        "cancel_order_and_restore_stock",
        { target_order_id: id },
      );
      if (cancelError) {
        throw new Error(cancelError.message);
      }
      return { id, status: "Cancelled" };
    }

    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return { id, status };
  },

  async deleteOrder(id: string): Promise<string> {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured. Cannot delete order.");
    }

    // Try cancellation first to restore any stock if not cancelled yet
    try {
      await supabase.rpc("cancel_order_and_restore_stock", { target_order_id: id });
    } catch {
      // Order may already be cancelled or processed
    }

    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      throw new Error(error.message);
    }

    return id;
  },
};

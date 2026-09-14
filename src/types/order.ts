export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Preparing"
  | "Baking"
  | "Dispatched"
  | "Delivered"
  | "Cancelled";

export type PaymentMethod = "cod" | "card" | "wallet";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  id?: string;
  orderId?: string;
  productId: number;
  productNameSnapshot: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryAddress?: string;
  boxSize: string;
  contents: string;
  subtotal?: number;
  deliveryFee?: number;
  discount?: number;
  totalPrice: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  status: OrderStatus;
  timestamp: string;
  items?: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

import type { OrderStatus } from "@src/types/order";

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Baking",
  "Dispatched",
  "Delivered",
  "Cancelled",
];

export const NEXT_ORDER_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  Pending: "Baking",
  Baking: "Dispatched",
  Dispatched: "Delivered",
};

export const ORDER_ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
  Pending: "Start Baking",
  Baking: "Mark Dispatched",
  Dispatched: "Mark Delivered",
};

export const ORDER_STEP_INDEX: Record<string, number> = {
  Pending: 0,
  Confirmed: 0,
  Preparing: 1,
  Baking: 1,
  Dispatched: 2,
  Delivered: 3,
};

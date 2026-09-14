import type { Product } from "./product";

export type BoxSize = 4 | 6 | 12;

export interface CartItem extends Product {
  cartItemId?: string;
}

export interface GroupedCartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  imageUrl: string;
}

import type { RootState } from "../../../store";

type CartItem = RootState["cart"]["items"][number];

export interface GroupedCartItem extends CartItem {
  quantity: number;
  totalPrice: number;
  indices: number[];
}
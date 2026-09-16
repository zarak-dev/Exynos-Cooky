import type { Cookie } from "@src/types/product";
import type { GroupedCartItem } from "@src/types/cart";
export type { GroupedCartItem };

export function groupCartItems(items: Cookie[]): GroupedCartItem[] {
  const map = new Map<string, GroupedCartItem>();

  for (const item of items) {
    const price = Number(item.price) || 0;
    const existing = map.get(item.name);

    if (existing) {
      existing.quantity += 1;
      existing.totalPrice += price;
    } else {
      map.set(item.name, {
        id: item.id,
        name: item.name,
        price,
        quantity: 1,
        totalPrice: price,
        imageUrl: item.imageUrl || "",
      });
    }
  }

  return Array.from(map.values());
}

export function buildContentsString(grouped: GroupedCartItem[]): string {
  return grouped.map(({ quantity, name }) => `${quantity}x ${name}`).join(", ");
}
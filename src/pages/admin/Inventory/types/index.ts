import type { ColumnsType } from "antd/es/table";
import type { Product } from "../../../../types/product";

export type CookieItem = Product;

export interface HandleAvailabilityChangeParams {
  id: number;
  checked: boolean;
}

export interface InventoryColumnsProps {
  onToggle: (id: number, checked: boolean) => void;
  onEdit: (cookie: Product) => void;
  onDelete: (id: number) => void;
}

export type InventoryColumns = ColumnsType<Product>;

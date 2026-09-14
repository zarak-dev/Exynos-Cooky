export type ProductCategory =
  | "classic"
  | "velvet_fruit"
  | "specialty"
  | "chocolate"
  | "all";

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  category?: ProductCategory;
  ingredients?: string[];
  allergens?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Backward-compatible alias for existing code
export type Cookie = Product;

export interface ProductFilterOptions {
  search?: string;
  category?: ProductCategory;
  sortBy?: "price-low" | "price-high" | "name" | "popularity";
  availableOnly?: boolean;
}

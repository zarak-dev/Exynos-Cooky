export interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode?: string;
}

export type PaymentMethod = "cod" | "card";

export interface GroupedCartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

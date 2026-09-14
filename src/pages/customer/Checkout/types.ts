import type { PaymentMethod } from "../../../types/order";

export interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode?: string;
}

export type { PaymentMethod };
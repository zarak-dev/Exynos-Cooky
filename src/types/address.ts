export interface Address {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  isDefault: boolean;
  createdAt?: string;
}

export type AddressInput = Omit<Address, "id" | "userId" | "createdAt">;

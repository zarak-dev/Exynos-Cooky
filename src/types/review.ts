export interface Review {
  id: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  userEmail?: string;
  productId?: number;
  productName?: string;
  orderId?: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface ReviewInput {
  productId?: number;
  orderId?: string;
  rating: number;
  comment: string;
}

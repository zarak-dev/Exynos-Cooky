export type AIMode = "assistant" | "box_builder" | "admin_insights";

export interface AIMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  recommendations?: AIRecommendation[];
  boxComposition?: AIBoxItem[];
}

export interface AIRecommendation {
  productId: number;
  productName: string;
  reason: string;
  price?: number;
}

export interface AIBoxItem {
  productId: number;
  productName: string;
  quantity: number;
  reason?: string;
}

export interface AIBoxRecommendation {
  boxSize: 4 | 6 | 12;
  items: AIBoxItem[];
  theme: string;
  explanation: string;
}

export interface AdminAIInsight {
  title: string;
  type: "positive" | "warning" | "opportunity";
  description: string;
  metric?: string;
  actionableStep?: string;
}

// ============================================================
// WHATSAPP SERVICE: Centralized External Messaging Boundary
// ============================================================
// Keeps external messaging logic isolated from UI components.
// Never exposes internal secrets. Ensures consistent message formatting.
// ============================================================

const WHATSAPP_PHONE_NUMBER = "923404646122";

function openWhatsAppWindow(text: string): void {
  const url = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export const whatsappService = {
  /**
   * Directly opens WhatsApp conversation with custom message.
   */
  sendWhatsAppMessage(message: string): void {
    openWhatsAppWindow(message);
  },

  /**
   * Opens general customer support chat.
   */
  openSupportChat(customMessage?: string): void {
    const text =
      customMessage ||
      "Hello Exynos Cooky! 🍪✨ I have a question about fresh cookies.";
    openWhatsAppWindow(text);
  },

  /**
   * Opens order tracking inquiry chat.
   */
  openOrderInquiry(orderId: string): void {
    const text = `Hi Exynos Cooky! 🍪 I'd like to check on my order #${orderId}.`;
    openWhatsAppWindow(text);
  },

  /**
   * Opens product inquiry chat.
   */
  openCookieInquiry(cookieName: string): void {
    const text = `Hi Exynos Cooky! 🍪 Is "${cookieName}" currently fresh in today's oven batch?`;
    openWhatsAppWindow(text);
  },

  /**
   * Get public WhatsApp chat link with optional pre-filled message (for semantic anchor links).
   */
  getSupportChatUrl(customMessage?: string): string {
    const text =
      customMessage ||
      "Hello Exynos Cooky! 🍪✨ I have a question about fresh cookies.";
    return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
  },

  /**
   * Get direct order inquiry WhatsApp chat link.
   */
  getOrderInquiryUrl(orderId: string): string {
    const text = `Hi Exynos Cooky! 🍪 I'd like to check on my order #${orderId}.`;
    return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
  },

  /**
   * Get product inquiry WhatsApp chat link.
   */
  getCookieInquiryUrl(cookieName: string): string {
    const text = `Hi Exynos Cooky! 🍪 Is "${cookieName}" currently fresh in today's oven batch?`;
    return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
  },
};

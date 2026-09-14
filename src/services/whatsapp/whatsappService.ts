// ============================================================
// WHATSAPP SERVICE: Clean External Integration Boundary
// ============================================================
// Keeps external messaging logic isolated from UI components.
// Never exposes API secrets. Ensures consistent message formatting.
// ============================================================

const WHATSAPP_PHONE_NUMBER = "923404646122";

export const whatsappService = {
  /**
   * Get public WhatsApp chat link with optional pre-filled message.
   */
  getSupportChatUrl(customMessage?: string): string {
    const text = customMessage || "Hello Exynos Cooky! 🍪✨ I have a question about fresh cookies.";
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

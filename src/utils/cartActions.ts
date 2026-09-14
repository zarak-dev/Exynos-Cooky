import type { Cookie } from "../types/product";
import type { MessageInstance } from "antd/es/message/interface";
import type { AppDispatch } from "../store";
import { addCookieToBox } from "../store/slices/cartSlice";

const NEXT_SIZE: Record<number, number | null> = { 4: 6, 6: 12, 12: null };

export const CART_FEEDBACK_MESSAGE_KEY = "cart_add_to_box_feedback";

let lastAddedCookieId: number | null = null;
let consecutiveAddCount = 0;
let resetTimer: ReturnType<typeof setTimeout> | null = null;

export function addCookieWithFeedback(
  cookie: Cookie,
  cartLength: number,
  boxSize: number,
  dispatch: AppDispatch,
  messageApi: MessageInstance,
) {
  const willUpgrade = cartLength >= boxSize && NEXT_SIZE[boxSize] !== null;
  const isFull = cartLength >= boxSize && NEXT_SIZE[boxSize] === null;

  if (isFull) {
    messageApi.open({
      key: CART_FEEDBACK_MESSAGE_KEY,
      type: "warning",
      content: "Your 12-Pack is full! Please checkout first.",
      duration: 2.5,
    });
    return;
  }

  // Always update cart state immediately
  dispatch(addCookieToBox(cookie));

  // Intelligent rapid-click aggregation
  if (lastAddedCookieId === cookie.id) {
    consecutiveAddCount += 1;
  } else {
    lastAddedCookieId = cookie.id;
    consecutiveAddCount = 1;
  }

  if (resetTimer) {
    clearTimeout(resetTimer);
  }
  resetTimer = setTimeout(() => {
    lastAddedCookieId = null;
    consecutiveAddCount = 0;
  }, 1600);

  if (willUpgrade) {
    const nextSize = NEXT_SIZE[boxSize];
    messageApi.open({
      key: CART_FEEDBACK_MESSAGE_KEY,
      type: "info",
      content: `Box upgraded to ${nextSize}-Pack to fit your cookie! 🍪`,
      duration: 2.5,
    });
  } else {
    const countSuffix = consecutiveAddCount > 1 ? ` (×${consecutiveAddCount})` : "";
    messageApi.open({
      key: CART_FEEDBACK_MESSAGE_KEY,
      type: "success",
      content: `Added ${cookie.name}${countSuffix} to your box! 🍪`,
      duration: 2.5,
    });
  }
}

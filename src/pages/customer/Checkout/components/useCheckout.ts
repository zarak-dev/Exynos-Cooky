import { useMemo, useState } from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type RootState } from "../../../../store";
import { DELIVERY_FEE } from "../../../../constants/pricing";
import { clearBox } from "../../../../store/slices/cartSlice";
import { placeNewOrder } from "../../../../store/slices/orderSlice";
import {
  groupCartItems,
  buildContentsString,
} from "../../../../utils/cartUtils";
import type { PaymentMethod } from "../types";

function generateOrderId(): string {
  return `EXY-${Math.floor(10000 + Math.random() * 90000)}`;
}

export function useCheckout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  const { items: cartItems, boxSize } = useSelector(
    (state: RootState) => state.cart,
  );

  const groupedCartItems = useMemo(
    () => groupCartItems(cartItems),
    [cartItems],
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0),
    0,
  );

  const deliveryFee = cartItems.length > 0 ? DELIVERY_FEE : 0;
  const totalAmount = subtotal + deliveryFee;

  function handleSubmit(values: { firstName: string; lastName: string }) {
    const orderId = generateOrderId();

    dispatch(
      placeNewOrder({
        id: orderId,
        customerName: `${values.firstName} ${values.lastName}`,
        boxSize: `${boxSize}-Pack Custom Box`,
        contents: buildContentsString(groupedCartItems),
        totalPrice: totalAmount,
        status: "Pending",
        timestamp: new Date().toISOString(),
      }),
    );

    dispatch(clearBox());
    setConfirmedOrderId(orderId);
    messageApi.success("Order dispatched successfully! 🍪");
  }

  return {
    contextHolder,
    confirmedOrderId,
    isOrdered: confirmedOrderId !== null,
    paymentMethod,
    setPaymentMethod,
    cartItems,
    groupedCartItems,
    boxSize,
    subtotal,
    deliveryFee,
    totalAmount,
    handleSubmit,
    navigate,
  };
}
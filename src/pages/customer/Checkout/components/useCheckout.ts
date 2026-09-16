import { useState, useEffect, useMemo } from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type RootState } from "@src/store";
import { DELIVERY_FEE } from "@src/constants/pricing";
import { clearBox } from "@src/store/slices/cartSlice";
import { createOrderRequest, type Order } from "@src/store/slices/orderSlice";
import { clearCoupon } from "@src/store/slices/couponSlice";
import {
  groupCartItems,
  buildContentsString,
} from "@src/utils/cartUtils";
import type { FormValues, PaymentMethod } from "@src/pages/customer/Checkout/types";

function generateOrderId(): string {
  return `EXY-${Math.floor(10000 + Math.random() * 90000)}`;
}

export function useCheckout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const user = useSelector((state: RootState) => state.auth.user);
  const { items: cartItems, boxSize } = useSelector(
    (state: RootState) => state.cart,
  );
  const appliedCoupon = useSelector(
    (state: RootState) => state.coupons.appliedCoupon,
  );
  const discountAmount = useSelector(
    (state: RootState) => state.coupons.discountAmount,
  );

  const { currentOrder, loading: orderLoading, error: orderError } = useSelector(
    (state: RootState) => state.orders,
  );

  // Derive order confirmation directly from Redux store state
  const isOrdered = Boolean(currentOrder);
  const confirmedOrderId = currentOrder?.id || null;
  const confirmedOrder = currentOrder;

  const groupedCartItems = useMemo(
    () => groupCartItems(cartItems),
    [cartItems],
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (Number(item.price) || 0),
        0,
      ),
    [cartItems],
  );

  const deliveryFee = cartItems.length > 0 ? DELIVERY_FEE : 0;
  const totalAmount = useMemo(
    () => Math.max(0, subtotal + deliveryFee - discountAmount),
    [subtotal, deliveryFee, discountAmount],
  );

  // When order completes successfully, clean up cart and notify
  useEffect(() => {
    if (currentOrder) {
      dispatch(clearBox());
      dispatch(clearCoupon());
      messageApi.success("Order confirmed and baking scheduled! 🍪");
    }
  }, [currentOrder, dispatch, messageApi]);

  // When order placement fails
  useEffect(() => {
    if (orderError) {
      messageApi.error(`Could not place order: ${orderError}`);
    }
  }, [orderError, messageApi]);

  function handleSubmit(values: FormValues) {
    const orderId = generateOrderId();

    const order: Order = {
      id: orderId,
      userId: user?.id,
      customerName: `${values.firstName} ${values.lastName}`,
      customerEmail: values.email || user?.email || "",
      customerPhone: values.phone || "",
      deliveryAddress: `${values.address}, ${values.city}${values.zipCode ? `, ${values.zipCode}` : ""}`,
      boxSize: `${boxSize}-Pack Custom Box`,
      contents: buildContentsString(groupedCartItems),
      subtotal,
      deliveryFee,
      discount: discountAmount,
      totalPrice: totalAmount,
      paymentMethod,
      paymentStatus: "pending",
      status: "Pending",
      timestamp: new Date().toISOString(),
      couponCode: appliedCoupon?.code,
      items: groupedCartItems.map((item) => ({
        productId: item.id,
        productNameSnapshot: item.name,
        unitPrice: item.price,
        quantity: item.quantity,
        subtotal: item.totalPrice,
      })),
    };

    dispatch(createOrderRequest(order));
  }

  return {
    contextHolder,
    confirmedOrderId,
    confirmedOrder,
    isOrdered,
    isSubmitting: orderLoading,
    paymentMethod,
    setPaymentMethod,
    cartItems,
    groupedCartItems,
    boxSize,
    subtotal,
    deliveryFee,
    discountAmount,
    totalAmount,
    handleSubmit,
    navigate,
  };
}

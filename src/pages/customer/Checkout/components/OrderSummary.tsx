import React, { useState } from "react";
import { Divider, Typography, Input, Button, Space, Tag } from "antd";
import { ShoppingCartOutlined, TagOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@src/store";
import {
  applyCouponRequest,
  clearCoupon,
} from "@src/store/slices/couponSlice";
import {
  OrderSummarySticky,
  SummaryRow,
  TotalRow,
  TotalText,
  SubmitButton,
} from "@src/pages/customer/Checkout/styles";
import type { GroupedCartItem } from "@src/utils/cartUtils";

const { Text } = Typography;

interface OrderSummaryProps {
  groupedCartItems: GroupedCartItem[];
  boxSize: number | string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  isSubmitting?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  groupedCartItems,
  boxSize,
  subtotal,
  deliveryFee,
  totalAmount,
  isSubmitting,
}) => {
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState("");
  const { appliedCoupon, discountAmount, loading: couponLoading, error: couponError } =
    useSelector((state: RootState) => state.coupons);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    dispatch(applyCouponRequest({ code: couponCode.trim(), subtotal }));
  };

  const handleRemoveCoupon = () => {
    dispatch(clearCoupon());
    setCouponCode("");
  };

  return (
    <OrderSummarySticky
      title={
        <>
          <ShoppingCartOutlined /> Order Summary
        </>
      }
      variant="borderless"
    >
      {groupedCartItems.map((item) => (
        <SummaryRow key={item.name} justify="space-between">
          <Text type="secondary">
            {item.quantity}x <Text strong>{item.name}</Text>
          </Text>
          <Text type="secondary">Rs. {item.totalPrice}</Text>
        </SummaryRow>
      ))}

      <Divider style={{ margin: "12px 0" }} />

      {/* Coupon Code Section */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: "block", marginBottom: 6, fontSize: 13 }}>
          Have a promo code?
        </Text>
        {appliedCoupon ? (
          <Space orientation="horizontal" style={{ width: "100%", justifyContent: "space-between" }}>
            <Tag color="success" icon={<TagOutlined />}>
              {appliedCoupon.code} (-Rs. {discountAmount})
            </Tag>
            <Button
              type="link"
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={handleRemoveCoupon}
            >
              Remove
            </Button>
          </Space>
        ) : (
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="e.g. WELCOME10"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onPressEnter={handleApplyCoupon}
            />
            <Button
              type="primary"
              onClick={handleApplyCoupon}
              loading={couponLoading}
            >
              Apply
            </Button>
          </Space.Compact>
        )}
        {couponError && (
          <Text type="danger" style={{ fontSize: 12, display: "block", marginTop: 4 }}>
            {couponError}
          </Text>
        )}
        {!appliedCoupon && !couponError && (
          <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: "block" }}>
            Try code <Tag color="blue">WELCOME10</Tag> or <Tag color="blue">SWEET20</Tag>
          </Text>
        )}
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <SummaryRow justify="space-between">
        <Text>Box Size:</Text>
        <Text strong>{boxSize}-Pack</Text>
      </SummaryRow>
      <SummaryRow justify="space-between">
        <Text>Subtotal:</Text>
        <Text strong>Rs. {subtotal}</Text>
      </SummaryRow>
      {discountAmount > 0 && (
        <SummaryRow justify="space-between">
          <Text style={{ color: "#389e0d" }}>Discount:</Text>
          <Text style={{ color: "#389e0d" }} strong>
            - Rs. {discountAmount}
          </Text>
        </SummaryRow>
      )}
      <SummaryRow justify="space-between">
        <Text>Delivery:</Text>
        <Text>Rs. {deliveryFee}</Text>
      </SummaryRow>

      <Divider style={{ margin: "12px 0" }} />

      <TotalRow justify="space-between" align="center">
        <TotalText level={4}>Total:</TotalText>
        <TotalText level={4}>Rs. {totalAmount}</TotalText>
      </TotalRow>

      <SubmitButton
        type="primary"
        htmlType="submit"
        block
        size="large"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Placing Order..." : `Place Order — Rs. ${totalAmount}`}
      </SubmitButton>
    </OrderSummarySticky>
  );
};

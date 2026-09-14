import React from "react";
import { Tag } from "antd";
import {
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { OrderStatus } from "../../../types/order";

interface StatusBadgeProps {
  status: OrderStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "Pending":
      return (
        <Tag icon={<ClockCircleOutlined />} color="warning">
          PENDING
        </Tag>
      );
    case "Confirmed":
      return (
        <Tag icon={<CheckCircleOutlined />} color="blue">
          CONFIRMED
        </Tag>
      );
    case "Preparing":
    case "Baking":
      return (
        <Tag icon={<SyncOutlined spin />} color="processing">
          BAKING
        </Tag>
      );
    case "Dispatched":
      return (
        <Tag icon={<CheckCircleOutlined />} color="cyan">
          DISPATCHED
        </Tag>
      );
    case "Delivered":
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          DELIVERED
        </Tag>
      );
    case "Cancelled":
      return (
        <Tag icon={<CloseCircleOutlined />} color="error">
          CANCELLED
        </Tag>
      );
    default:
      return <Tag color="default">{status.toUpperCase()}</Tag>;
  }
};

import React from "react";
import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Text from "antd/es/typography/Text";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import { type Order } from "../../../../store/slices/orderSlice";

import { PriceText } from "../styles";
import OrderActions from "./orderActions";

const NEXT_STATUS: Partial<Record<Order["status"], Order["status"]>> = {
  Pending: "Baking",
  Baking: "Dispatched",
  Dispatched: "Delivered",
};

const ACTION_LABELS: Partial<Record<Order["status"], string>> = {
  Pending: "Start Baking",
  Baking: "Mark Dispatched",
  Dispatched: "Mark Delivered",
};

const STATUS_TAGS: Record<Order["status"], React.ReactNode> = {
  Pending: (
    <Tag icon={<ClockCircleOutlined />} color="warning">
      PENDING QUEUE
    </Tag>
  ),
  Baking: (
    <Tag icon={<SyncOutlined spin />} color="processing">
      IN OVEN / BAKING
    </Tag>
  ),
  Dispatched: (
    <Tag icon={<CheckCircleOutlined />} color="success">
      DISPATCHED
    </Tag>
  ),
  Delivered: (
    <Tag icon={<CheckCircleOutlined />} color="default">
      DELIVERED
    </Tag>
  ),
};

type Props = {
  onStatusChange: (id: string, status: Order["status"]) => void;
  onDelete: (id: string) => void;
};

export const getOrderColumns = ({
  onStatusChange,
  onDelete,
}: Props): ColumnsType<Order> => [
  {
    title: "ORDER ID",
    dataIndex: "id",
    render: (id) => <Text code>{id}</Text>,
  },
  {
    title: "CUSTOMER",
    dataIndex: "customerName",
    render: (name) => <Text strong>{name}</Text>,
  },
  {
    title: "BOX SELECTION",
    dataIndex: "boxSize",
  },
  {
    title: "CONTENTS SUMMARY",
    dataIndex: "contents",
    ellipsis: true,
  },
  {
    title: "TOTAL",
    dataIndex: "totalPrice",
    render: (price) => <PriceText>Rs. {price}</PriceText>,
  },
  {
    title: "STATUS",
    dataIndex: "status",
    render: (status: Order["status"]) => STATUS_TAGS[status],
  },
  {
    title: "ACTIONS",
    width: 200,
    render: (_, order) => (
      <OrderActions
        order={order}
        buttonLabel={ACTION_LABELS[order.status]}
        nextStatus={NEXT_STATUS[order.status]}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />
    ),
  },
];

import { Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { type Order } from "@src/store/slices/orderSlice";
import OrderActions from "./orderActions";

const { Text, Link } = Typography;

export const nextStatus: Partial<Record<Order["status"], Order["status"]>> = {
  Pending: "Baking",
  Baking: "Dispatched",
  Dispatched: "Delivered",
};

export const actionLabel: Partial<Record<Order["status"], string>> = {
  Pending: "Start Baking",
  Baking: "Mark Dispatched",
  Dispatched: "Mark Delivered",
};

export const statusTags: Partial<Record<Order["status"], React.ReactNode>> = {
  Pending: (
    <Tag icon={<ClockCircleOutlined />} color="warning" style={{ borderRadius: 6, fontWeight: 600 }}>
      Pending
    </Tag>
  ),
  Baking: (
    <Tag icon={<SyncOutlined spin />} color="processing" style={{ borderRadius: 6, fontWeight: 600 }}>
      Baking
    </Tag>
  ),
  Dispatched: (
    <Tag icon={<CheckCircleOutlined />} color="success" style={{ borderRadius: 6, fontWeight: 600 }}>
      Dispatched
    </Tag>
  ),
  Delivered: (
    <Tag icon={<CheckCircleOutlined />} color="default" style={{ borderRadius: 6, fontWeight: 600 }}>
      Delivered
    </Tag>
  ),
  Cancelled: (
    <Tag icon={<CloseCircleOutlined />} color="error" style={{ borderRadius: 6, fontWeight: 600 }}>
      Cancelled
    </Tag>
  ),
};

const STATUS_ORDER: Record<Order["status"], number> = {
  Pending: 0,
  Confirmed: 0,
  Preparing: 1,
  Baking: 1,
  Dispatched: 2,
  Delivered: 3,
  Cancelled: -1,
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
    width: "12%",
    sorter: (a, b) => a.id.localeCompare(b.id),
    render: (id) => (
      <Link style={{ whiteSpace: "nowrap", fontWeight: 700, color: "#00009c" }}>
        {id}
      </Link>
    ),
  },
  {
    title: "CUSTOMER",
    dataIndex: "customerName",
    width: "14%",
    ellipsis: true,
    sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    render: (name) => <Text strong style={{ color: "#1e293b" }}>{name}</Text>,
  },
  {
    title: "PACKAGE",
    dataIndex: "boxSize",
    width: "10%",
    sorter: (a, b) => a.boxSize.localeCompare(b.boxSize),
    render: (box: string) => (
      <Tag color="purple" style={{ borderRadius: 6, fontWeight: 600, fontSize: 11.5 }}>
        {box || "Custom"}
      </Tag>
    ),
  },
  {
    title: "CONTENTS SUMMARY",
    dataIndex: "contents",
    ellipsis: true,
    render: (contents: string) => (
      <Text type="secondary" title={contents} style={{ fontSize: 12.5 }}>
        {contents || "—"}
      </Text>
    ),
  },
  {
    title: "TOTAL",
    dataIndex: "totalPrice",
    width: "11%",
    sorter: (a, b) => a.totalPrice - b.totalPrice,
    render: (price) => (
      <Text strong style={{ color: "#00009c", whiteSpace: "nowrap" }}>
        Rs. {Number(price).toLocaleString()}
      </Text>
    ),
  },
  {
    title: "STATUS",
    dataIndex: "status",
    width: "13%",
    sorter: (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
    filters: [
      { text: "Pending", value: "Pending" },
      { text: "Baking", value: "Baking" },
      { text: "Dispatched", value: "Dispatched" },
      { text: "Delivered", value: "Delivered" },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status: Order["status"]) => (
      <span style={{ whiteSpace: "nowrap" }}>{statusTags[status]}</span>
    ),
  },
  {
    title: "ACTIONS",
    width: "19%",
    render: (_, order) => (
      <OrderActions
        order={order}
        buttonLabel={actionLabel[order.status]}
        nextStatus={nextStatus[order.status]}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
      />
    ),
  },
];
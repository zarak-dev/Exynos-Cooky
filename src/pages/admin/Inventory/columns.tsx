import { Button, Popconfirm, Flex, Switch, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Text from "antd/es/typography/Text";
import { CookieImage, StatusTag } from "./styles";
import type { InventoryColumnsProps, InventoryColumns } from "./types";
import type { Product } from "@src/types/product";

export const getInventoryColumns = ({
  onToggle,
  onEdit,
  onDelete,
}: InventoryColumnsProps): InventoryColumns => [
  {
    title: "IMAGE",
    dataIndex: "imageUrl",
    key: "imageUrl",
    width: 65,
    render: (url: string, record: Product) => (
      <CookieImage
        src={url}
        alt={record.name}
        width={42}
        height={42}
        style={{ borderRadius: 8, objectFit: "cover" }}
      />
    ),
  },
  {
    title: "COOKIE NAME",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (text: string) => (
      <Text strong style={{ color: "#0f172a" }}>
        {text}
      </Text>
    ),
  },
  {
    title: "PRICE",
    dataIndex: "price",
    key: "price",
    width: "15%",
    sorter: (a, b) => a.price - b.price,
    render: (price: number) => (
      <Text strong style={{ color: "#00009c", whiteSpace: "nowrap" }}>
        Rs. {price.toLocaleString()}
      </Text>
    ),
  },
  {
    title: "STOCK",
    dataIndex: "stock",
    key: "stock",
    width: "17%",
    sorter: (a, b) => a.stock - b.stock,
    render: (stock: number) => {
      if (stock === 0) {
        return (
          <Tag color="error" style={{ borderRadius: 6, fontWeight: 600 }}>
            Out of Stock
          </Tag>
        );
      }
      if (stock <= 5) {
        return (
          <Tag color="warning" style={{ borderRadius: 6, fontWeight: 600 }}>
            Low Stock ({stock})
          </Tag>
        );
      }
      return (
        <Tag color="default" style={{ borderRadius: 6 }}>
          {stock} units
        </Tag>
      );
    },
  },
  {
    title: "STATUS",
    dataIndex: "isAvailable",
    key: "isAvailable",
    width: "15%",
    sorter: (a, b) => Number(b.isAvailable) - Number(a.isAvailable),
    filters: [
      { text: "Available", value: true },
      { text: "Sold Out", value: false },
    ],
    onFilter: (value, record) => record.isAvailable === value,
    render: (isAvailable: boolean) => (
      <StatusTag color={isAvailable ? "success" : "error"}>
        {isAvailable ? "AVAILABLE" : "SOLD OUT"}
      </StatusTag>
    ),
  },
  {
    title: "ACTION",
    key: "action",
    width: "16%",
    render: (_: unknown, record: Product) => (
      <Flex align="center" gap={6}>
        <Switch
          size="small"
          checkedChildren="ON"
          unCheckedChildren="OFF"
          checked={record.isAvailable}
          onChange={(checked) => onToggle(record.id, checked)}
        />
        <Button
          size="small"
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit(record)}
          title="Edit Cookie"
        />
        <Popconfirm
          title="Delete this cookie?"
          description="It will be removed from inventory permanently."
          okText="Delete"
          okType="danger"
          cancelText="Cancel"
          onConfirm={() => onDelete(record.id)}
        >
          <Button size="small" type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Flex>
    ),
  },
];
import { Button, Popconfirm, Space, Switch, Tag } from "antd";
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
    width: 90,
    render: (url: string, record: Product) => (
      <CookieImage src={url} alt={record.name} width={55} />
    ),
  },
  {
    title: "COOKIE NAME",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (text: string) => <Text strong>{text}</Text>,
  },
  {
    title: "PRICE",
    dataIndex: "price",
    key: "price",
    sorter: (a, b) => a.price - b.price,
    render: (price: number) => <Text>Rs. {price}</Text>,
  },
  {
    title: "STOCK",
    dataIndex: "stock",
    key: "stock",
    sorter: (a, b) => a.stock - b.stock,
    render: (stock: number) => {
      if (stock === 0) {
        return <Tag color="error">Out of Stock</Tag>;
      }
      if (stock <= 5) {
        return <Tag color="warning">Low Stock ({stock})</Tag>;
      }
      return <Text>{stock} units</Text>;
    },
  },
  {
    title: "STATUS",
    dataIndex: "isAvailable",
    key: "isAvailable",
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
    width: 180,
    render: (_: unknown, record: Product) => (
      <Space>
        <Switch
          checkedChildren="ON"
          unCheckedChildren="OFF"
          checked={record.isAvailable}
          onChange={(checked) => onToggle(record.id, checked)}
        />
        <Button
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
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    ),
  },
];
import React from "react";
import { Table, Switch, Space, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSelector, useDispatch } from "react-redux";
import { toggleItemAvailability } from "../../../store/slices/inventorySlice";
import { type RootState } from "../../../store";
import type { CookieItem } from "./types";
import {
  InventoryContainer,
  PageTitle,
  InventoryCard,
  CookieImage,
  CookieNameText,
  StatusTag,
  PriceText,
} from "./styles";

export const AdminInventory: React.FC = () => {
  const inventory = useSelector((state: RootState) => state.inventory.items);
  const dispatch = useDispatch();

  const handleAvailabilityChange = (id: number, checked: boolean) => {
    dispatch(toggleItemAvailability({ id, isAvailable: checked }));

    const targetItem = inventory.find((item) => item.id === id);

    if (checked) {
      message.success(`"${targetItem?.name}" is now active on the storefront!`);
    } else {
      message.warning(`"${targetItem?.name}" marked as Sold Out.`);
    }
  };

  const columns: ColumnsType<CookieItem> = [
    {
      title: "IMAGE",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 100,
      render: (url: string, record) => (
        <CookieImage src={url} alt={record.name} width={60} />
      ),
    },
    {
      title: "COOKIE NAME",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <CookieNameText strong>{text}</CookieNameText>,
    },
    {
      title: "PRICE",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <PriceText>Rs. {price}</PriceText>,
    },
    {
      title: "STATUS",
      dataIndex: "isAvailable",
      key: "isAvailable",
      render: (isAvailable: boolean) => (
        <StatusTag color={isAvailable ? "success" : "error"}>
          {isAvailable ? "AVAILABLE" : "SOLD OUT"}
        </StatusTag>
      ),
    },
    {
      title: "TOGGLE AVAILABILITY",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Switch
            checkedChildren="ON"
            unCheckedChildren="OFF"
            checked={record.isAvailable}
            onChange={(checked) => handleAvailabilityChange(record.id, checked)}
          />
        </Space>
      ),
    },
  ];

  return (
    <InventoryContainer>
      <PageTitle level={1}>INVENTORY MANAGEMENT</PageTitle>

      <InventoryCard>
        <Table
          columns={columns}
          dataSource={inventory}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      </InventoryCard>
    </InventoryContainer>
  );
};

export default AdminInventory;

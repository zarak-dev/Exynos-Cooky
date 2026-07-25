import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Tag, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { updateOrderStatus, type Order } from "../../../../../store/slices/orderSlice";
import { type RootState } from "../../../../../store";
import {
  OrdersContainer,
  PageTitle,
  OrdersCard,
  OrderIdText,
  CustomerNameText,
  PriceText,
  CompleteText
} from "./styles";

export const AdminOrders: React.FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state: RootState) => state.orders.orders);
  
  const advanceOrderStatus = (orderId: string, currentStatus: string) => {
    // Map your status progression (e.g. Pending -> Baking -> Dispatched)
    let nextStatus: "Pending" | "Baking" | "Dispatched" | "Delivered" =
      "Pending";

    if (currentStatus === "Pending") nextStatus = "Baking";
    else if (currentStatus === "Baking") nextStatus = "Dispatched";
    else if (currentStatus === "Dispatched") nextStatus = "Delivered";
    
    // Dispatch directly to Redux!
    dispatch(updateOrderStatus({ id: orderId, status: nextStatus }));
  };

  const columns: ColumnsType<Order> = [
    {
      title: "ORDER ID",
      dataIndex: "id",
      key: "id",
      render: (text) => (
        <OrderIdText code>{text}</OrderIdText>
      ),
    },
    {
      title: "CUSTOMER",
      dataIndex: "customerName",
      key: "customerName",
      render: (text) => <CustomerNameText strong>{text}</CustomerNameText>,
    },
    {
      title: "BOX SELECTION",
      dataIndex: "boxSize",
      key: "boxSize",
    },
    {
      title: "CONTENTS SUMMARY",
      dataIndex: "contents",
      key: "contents",
      ellipsis: true,
    },
    {
      title: "TOTAL",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (val) => <PriceText>Rs. {val}</PriceText>,
    },
    {
      title: "FULFILLMENT STATUS",
      dataIndex: "status",
      key: "status",
      render: (status: Order["status"]) => {
        if (status === "Pending")
          return (
            <Tag icon={<ClockCircleOutlined />} color="warning">
              PENDING QUEUE
            </Tag>
          );
        if (status === "Baking")
          return (
            <Tag icon={<SyncOutlined spin />} color="processing">
              IN OVEN / BAKING
            </Tag>
          );
        if (status === "Dispatched")
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              DISPATCHED
            </Tag>
          );
        return (
          <Tag icon={<CheckCircleOutlined />} color="default">
            DELIVERED
          </Tag>
        );
      },
    },
    {
      title: "PIPELINE ACTIONS",
      key: "actions",
      render: (_, record) => {
        const nextActionLabel: Partial<Record<Order["status"], string>> = {
          Pending: "Start Baking",
          Baking: "Mark Dispatched",
          Dispatched: "Mark Delivered",
        };

        return (
          <Space size="middle">
            {record.status !== "Delivered" ? (
              <Button
                type="primary"
                size="small"
                onClick={() => advanceOrderStatus(record.id, record.status)}
              >
                {nextActionLabel[record.status]}
              </Button>
            ) : (
              <CompleteText>
                Complete ✓
              </CompleteText>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <OrdersContainer>
      <PageTitle level={1}>
        CUSTOMER ORDERS STREAM
      </PageTitle>

      <OrdersCard bordered={false}>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={false}
        />
      </OrdersCard>
    </OrdersContainer>
  );
};

export default AdminOrders;
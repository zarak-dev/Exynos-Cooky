import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Tag, Button, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  updateOrderStatus,
  type Order,
  deleteOrder,
} from "../../../store/slices/orderSlice";
import { type RootState } from "../../../store";
import {
  OrdersContainer,
  PageTitle,
  OrdersCard,
  OrderIdText,
  CustomerNameText,
  PriceText,
  CompleteText,
  ActionWrapper,
  StatusActionContainer,
} from "./styles";

export const AdminOrders: React.FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector((state: RootState) => state.orders.orders);

  const advanceOrderStatus = (orderId: string, currentStatus: string) => {
    let nextStatus: "Pending" | "Baking" | "Dispatched" | "Delivered" =
      "Pending";

    if (currentStatus === "Pending") nextStatus = "Baking";
    else if (currentStatus === "Baking") nextStatus = "Dispatched";
    else if (currentStatus === "Dispatched") nextStatus = "Delivered";
    dispatch(updateOrderStatus({ id: orderId, status: nextStatus }));
  };

  const handleDeleteOrder = (orderId: string) => {
    dispatch(deleteOrder(orderId));
  };

  const columns: ColumnsType<Order> = [
    {
      title: "ORDER ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <OrderIdText code>{text}</OrderIdText>,
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
      title: "ACTIONS",
      key: "actions",
      width: 200,
      render: (_, record) => {
        const nextActionLabel: Partial<Record<Order["status"], string>> = {
          Pending: "Start Baking",
          Baking: "Mark Dispatched",
          Dispatched: "Mark Delivered",
        };

        return (
          <ActionWrapper>
            <StatusActionContainer>
              {record.status !== "Delivered" ? (
                <Button
                  type="primary"
                  size="small"
                  onClick={() => advanceOrderStatus(record.id, record.status)}
                  block
                >
                  {nextActionLabel[record.status]}
                </Button>
              ) : (
                <CompleteText>Complete ✓</CompleteText>
              )}
            </StatusActionContainer>

            <Popconfirm
              title="Delete Order"
              description={`Are you sure you want to delete order ${record.id}?`}
              onConfirm={() => handleDeleteOrder(record.id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              placement="left"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined style={{ fontSize: "1.2rem" }} />}
              />
            </Popconfirm>
          </ActionWrapper>
        );
      },
    },
  ];

  return (
    <OrdersContainer>
      <PageTitle level={1}>CUSTOMER ORDERS STREAM</PageTitle>

      <OrdersCard variant="borderless">
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={false}
          scroll={{ x: "900px" }}
        />
      </OrdersCard>
    </OrdersContainer>
  );
};

export default AdminOrders;

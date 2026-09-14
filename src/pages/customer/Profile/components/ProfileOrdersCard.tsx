import React from "react";
import { Table, Empty, Button, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import type { Order } from "../../../../types/order";
import { ContentWrapper, HeaderRow } from "../styles";
import { StyledTitle } from "../../../../components/StyledTitle";

const { Text } = Typography;

interface ProfileOrdersCardProps {
  orders: Order[];
}

export const ProfileOrdersCard: React.FC<ProfileOrdersCardProps> = ({ orders }) => {
  const navigate = useNavigate();

  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() => navigate(`/track-order?id=${id}`)}
        >
          {id}
        </Button>
      ),
    },
    {
      title: "Date",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString() : "N/A",
    },
    {
      title: "Box",
      dataIndex: "boxSize",
      key: "boxSize",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "Delivered"
            ? "success"
            : status === "Baking"
              ? "processing"
              : status === "Dispatched"
                ? "blue"
                : "warning";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value: number) => <Text strong>Rs. {value}</Text>,
    },
  ];

  return (
    <ContentWrapper>
      <HeaderRow style={{ marginBottom: 16 }}>
        <StyledTitle level={4}>Your Order History</StyledTitle>
      </HeaderRow>
      {orders.length ? (
        <Table
          rowKey="id"
          columns={orderColumns}
          dataSource={orders}
          pagination={{ pageSize: 6 }}
          scroll={{ x: 600 }}
        />
      ) : (
        <Empty description="You haven't placed any orders yet" />
      )}
    </ContentWrapper>
  );
};

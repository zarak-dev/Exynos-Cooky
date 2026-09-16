import React, { useState } from "react";
import { Table, Empty, Button, Tag, Typography, Space, Flex, Divider, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight, Clock, Cookie } from "lucide-react";
import type { Order } from "@src/types/order";
import { ContentWrapper, HeaderRow } from "@src/pages/customer/Profile/styles";
import { StyledTitle } from "@src/components/StyledTitle";
import { StyledCard } from "@src/components/StyledCard";
import { useMediaQuery } from "@src/hooks/useMediaQuery";
import styled from "styled-components";

const { Text } = Typography;

interface ProfileOrdersCardProps {
  orders: Order[];
}

const MobileOrderCard = styled(StyledCard)`
  margin-bottom: 14px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 156, 0.04);
  transition: all 0.2s ease;

  &:hover {
    border-color: #c7d2fe;
    box-shadow: 0 4px 14px rgba(0, 0, 156, 0.08);
  }

  .ant-card-body {
    padding: 16px;
  }
`;

const CookieBadge = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00009c;
  flex-shrink: 0;
`;

export const ProfileOrdersCard: React.FC<ProfileOrdersCardProps> = ({ orders }) => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [mobilePage, setMobilePage] = useState(1);
  const mobilePageSize = 4;

  const renderStatusTag = (status?: string) => {
    let color = "default";
    let label = status || "Pending";

    switch (status?.toLowerCase()) {
      case "delivered":
        color = "success";
        label = "Delivered";
        break;
      case "baking":
        color = "processing";
        label = "Baking Fresh 🍪";
        break;
      case "dispatched":
        color = "blue";
        label = "On The Way 🚚";
        break;
      case "pending":
        color = "warning";
        label = "Order Received";
        break;
      case "cancelled":
        color = "error";
        label = "Cancelled";
        break;
      default:
        color = "default";
    }

    return (
      <Tag
        color={color}
        style={{
          padding: "3px 10px",
          borderRadius: 6,
          fontWeight: 600,
          fontSize: 12,
          margin: 0,
        }}
      >
        {label}
      </Tag>
    );
  };

  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => (
        <Space size={6}>
          <Cookie size={16} style={{ color: "#00009c" }} />
          <Button
            type="link"
            style={{ padding: 0, fontWeight: 700, color: "#00009c", fontSize: 13.5 }}
            onClick={() => navigate(`/track-order?id=${id}`)}
          >
            {id}
          </Button>
        </Space>
      ),
    },
    {
      title: "Order Date",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (value: string) => (
        <Space size={6} style={{ whiteSpace: "nowrap" }}>
          <Clock size={14} style={{ color: "#64748b" }} />
          <Text style={{ color: "#475569", fontSize: 13 }}>
            {value
              ? new Date(value).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Recent"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Box Selection",
      dataIndex: "boxSize",
      key: "boxSize",
      render: (boxSize: string) => (
        <Tag color="purple" style={{ borderRadius: 6, fontWeight: 600, fontSize: 12 }}>
          {boxSize || "Custom Box"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => renderStatusTag(status),
    },
    {
      title: "Total Paid",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value: number) => (
        <Text strong style={{ color: "#00009c", fontSize: 14, whiteSpace: "nowrap" }}>
          Rs. {Number(value || 0).toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Track",
      key: "action",
      render: (_: unknown, record: Order) => (
        <Button
          type="primary"
          size="small"
          shape="round"
          style={{
            background: "#00009c",
            borderColor: "#00009c",
            fontWeight: 600,
            fontSize: 12,
          }}
          onClick={() => navigate(`/track-order?id=${record.id}`)}
          icon={<ArrowRight size={13} />}
          iconPlacement="end"
        >
          Track
        </Button>
      ),
    },
  ];

  // Mobile slice of orders
  const paginatedMobileOrders = orders.slice(
    (mobilePage - 1) * mobilePageSize,
    mobilePage * mobilePageSize,
  );

  return (
    <ContentWrapper>
      <HeaderRow>
        <div>
          <StyledTitle level={4} style={{ margin: 0, color: "#00009c" }}>
            Your Order History
          </StyledTitle>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Review past batches, delivery tracking, and receipt details
          </Text>
        </div>
      </HeaderRow>

      {orders.length === 0 ? (
        <StyledCard style={{ textAlign: "center", padding: "48px 24px", borderRadius: 14 }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text strong style={{ fontSize: 16, display: "block", marginBottom: 6 }}>
                  No Cookie Orders Yet
                </Text>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Your oven-fresh gourmet cookie journey begins today!
                </Text>
              </div>
            }
          >
            <Button
              type="primary"
              size="large"
              shape="round"
              style={{
                background: "#00009c",
                borderColor: "#00009c",
                marginTop: 14,
                fontWeight: 600,
              }}
              icon={<ShoppingBag size={16} style={{ marginRight: 6 }} />}
              onClick={() => navigate("/buy-cooky")}
            >
              Order Fresh Cookies
            </Button>
          </Empty>
        </StyledCard>
      ) : isDesktop ? (
        /* DESKTOP VIEW: Full Wide Table */
        <StyledCard style={{ padding: 0, overflow: "hidden", borderRadius: 14 }}>
          <Table
            rowKey="id"
            columns={orderColumns}
            dataSource={orders}
            pagination={{ pageSize: 6, position: ["bottomCenter"] }}
            scroll={{ x: 680 }}
          />
        </StyledCard>
      ) : (
        /* MOBILE VIEW: Clean Native Card List without horizontal scrollbar */
        <Flex vertical gap={4} style={{ width: "100%" }}>
          {paginatedMobileOrders.map((order) => (
            <MobileOrderCard key={order.id}>
              {/* Header: Cookie Icon + ID + Status Tag */}
              <Flex justify="space-between" align="center" gap={8}>
                <Flex align="center" gap={10}>
                  <CookieBadge>
                    <Cookie size={18} />
                  </CookieBadge>
                  <div>
                    <Button
                      type="link"
                      style={{
                        padding: 0,
                        fontWeight: 700,
                        color: "#00009c",
                        fontSize: 15,
                        height: "auto",
                      }}
                      onClick={() => navigate(`/track-order?id=${order.id}`)}
                    >
                      {order.id}
                    </Button>
                    <Flex align="center" gap={4} style={{ marginTop: 2 }}>
                      <Clock size={12} style={{ color: "#64748b" }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {order.timestamp
                          ? new Date(order.timestamp).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "Recent"}
                      </Text>
                    </Flex>
                  </div>
                </Flex>
                {renderStatusTag(order.status)}
              </Flex>

              <Divider style={{ margin: "12px 0" }} />

              {/* Body: Package Box & Total Amount */}
              <Flex justify="space-between" align="center" gap={8}>
                <div>
                  <Text type="secondary" style={{ fontSize: 11, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Package
                  </Text>
                  <Tag color="purple" style={{ margin: "3px 0 0 0", fontWeight: 600, borderRadius: 6 }}>
                    {order.boxSize || "Custom Box"}
                  </Tag>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text type="secondary" style={{ fontSize: 11, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Total Amount
                  </Text>
                  <Text strong style={{ fontSize: 16, color: "#00009c", display: "block", marginTop: 2 }}>
                    Rs. {Number(order.totalPrice || 0).toLocaleString()}
                  </Text>
                </div>
              </Flex>

              {/* Action Button: Direct Track Order */}
              <Button
                type="primary"
                block
                shape="round"
                size="middle"
                style={{
                  marginTop: 14,
                  background: "#00009c",
                  borderColor: "#00009c",
                  fontWeight: 600,
                  fontSize: 13,
                  height: 38,
                }}
                icon={<ArrowRight size={14} />}
                iconPlacement="end"
                onClick={() => navigate(`/track-order?id=${order.id}`)}
              >
                Track Order Live
              </Button>
            </MobileOrderCard>
          ))}

          {orders.length > mobilePageSize && (
            <Flex justify="center" style={{ marginTop: 12 }}>
              <Pagination
                simple
                size="small"
                current={mobilePage}
                total={orders.length}
                pageSize={mobilePageSize}
                onChange={(page) => setMobilePage(page)}
              />
            </Flex>
          )}
        </Flex>
      )}
    </ContentWrapper>
  );
};

export default ProfileOrdersCard;

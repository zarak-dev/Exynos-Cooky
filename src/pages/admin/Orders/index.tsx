import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Button, Flex, Typography, Tag, Popconfirm, Pagination, Empty, Spin, Divider } from "antd";
import { SearchOutlined, DeleteOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Cookie } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "@src/store";
import {
  deleteOrderRequest,
  updateOrderStatusRequest,
  fetchOrdersRequest,
} from "@src/store/slices/orderSlice";
import { OrdersCard, MobileOrderQueueCard, ResponsiveToolbar } from "./styles";
import {
  getOrderColumns,
  nextStatus,
  actionLabel,
  statusTags,
} from "./components/orderTableColumns";
import StyledPageHeader from "@src/components/PageHeader";
import { StyledInput } from "@src/components/StyledInput";
import { Wrapper } from "@src/components/Wrapper";
import { useMediaQuery } from "@src/hooks/useMediaQuery";

const { Text } = Typography;

const AdminOrders: React.FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const loading = useSelector((state: RootState) => state.orders.loading);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [search, setSearch] = useState("");
  const [mobilePage, setMobilePage] = useState(1);
  const mobilePageSize = 5;

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchOrdersRequest());
    }
  }, [dispatch, orders.length]);

  const handleStatusChange = useCallback(
    (id: string, status: Parameters<typeof updateOrderStatusRequest>[0]["status"]) =>
      dispatch(updateOrderStatusRequest({ id, status })),
    [dispatch],
  );

  const handleDelete = useCallback(
    (id: string) => dispatch(deleteOrderRequest(id)),
    [dispatch],
  );

  const columns = useMemo(
    () =>
      getOrderColumns({
        onStatusChange: handleStatusChange,
        onDelete: handleDelete,
      }),
    [handleStatusChange, handleDelete],
  );

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter(
      (order) =>
        order.customerName.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query),
    );
  }, [orders, search]);

  const paginatedMobileOrders = useMemo(() => {
    return filteredOrders.slice(
      (mobilePage - 1) * mobilePageSize,
      mobilePage * mobilePageSize,
    );
  }, [filteredOrders, mobilePage]);

  return (
    <>
      <StyledPageHeader
        title="Customer Orders"
        breadcrumbs={[{ title: "Admin" }, { title: "Orders" }]}
      />
      <Wrapper>
        <OrdersCard variant="borderless">
          {/* Responsive Header Toolbar */}
          <ResponsiveToolbar>
            <span className="title-text">Orders Queue ({filteredOrders.length})</span>
            <div className="search-input">
              <StyledInput
                placeholder="Search by customer or order ID..."
                allowClear
                suffix={<SearchOutlined />}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setMobilePage(1);
                }}
              />
            </div>
          </ResponsiveToolbar>

          {isDesktop ? (
            /* DESKTOP TABLE VIEW */
            <Table
              rowKey="id"
              tableLayout="fixed"
              columns={columns}
              dataSource={filteredOrders}
              loading={loading}
              pagination={{ pageSize: 10, position: ["bottomCenter"] }}
            />
          ) : (
            /* MOBILE RESPONSIVE CARD VIEW */
            <Spin spinning={loading}>
              {filteredOrders.length === 0 ? (
                <Empty description="No orders matching search" style={{ padding: "32px 0" }} />
              ) : (
                <Flex vertical gap={4}>
                  {paginatedMobileOrders.map((order) => {
                    const nextSt = nextStatus[order.status];
                    const nextLbl = actionLabel[order.status];
                    const canCancel = order.status !== "Delivered" && order.status !== "Cancelled";

                    return (
                      <MobileOrderQueueCard key={order.id}>
                        {/* Header: ID + Status */}
                        <Flex justify="space-between" align="center" gap={8}>
                          <Flex align="center" gap={6}>
                            <Cookie size={16} color="#00009c" />
                            <Text strong style={{ color: "#00009c", fontSize: 14 }}>
                              {order.id}
                            </Text>
                          </Flex>
                          <div>{statusTags[order.status]}</div>
                        </Flex>

                        <Divider style={{ margin: "10px 0" }} />

                        {/* Customer & Box */}
                        <Flex justify="space-between" align="center" gap={8}>
                          <div>
                            <Text type="secondary" style={{ fontSize: 11, display: "block", textTransform: "uppercase" }}>
                              Customer
                            </Text>
                            <Text strong style={{ fontSize: 14, color: "#09090b" }}>
                              {order.customerName}
                            </Text>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <Text type="secondary" style={{ fontSize: 11, display: "block", textTransform: "uppercase" }}>
                              Package
                            </Text>
                            <Tag color="purple" style={{ margin: "2px 0 0 0", fontWeight: 600 }}>
                              {order.boxSize || "Custom Box"}
                            </Tag>
                          </div>
                        </Flex>

                        {/* Contents Summary */}
                        {order.contents && (
                          <div style={{ marginTop: 10, padding: "8px 10px", background: "#f8fafc", borderRadius: 8, border: "1px solid #f1f5f9" }}>
                            <Text type="secondary" style={{ fontSize: 11, display: "block", fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>
                              Box Contents
                            </Text>
                            <Text style={{ fontSize: 12.5, color: "#334155" }}>
                              {order.contents}
                            </Text>
                          </div>
                        )}

                        {/* Total Price */}
                        <Flex justify="space-between" align="center" style={{ marginTop: 12 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Total Price:
                          </Text>
                          <Text strong style={{ fontSize: 16, color: "#00009c" }}>
                            Rs. {Number(order.totalPrice || 0).toLocaleString()}
                          </Text>
                        </Flex>

                        {/* Order Progression Actions */}
                        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                          {nextSt && nextLbl && (
                            <Button
                              type="primary"
                              block
                              shape="round"
                              style={{
                                background: "#00009c",
                                borderColor: "#00009c",
                                fontWeight: 600,
                                height: 38,
                              }}
                              onClick={() => handleStatusChange(order.id, nextSt)}
                            >
                              {nextLbl}
                            </Button>
                          )}

                          <Flex gap={8} justify="flex-end" style={{ marginTop: 2 }}>
                            {canCancel && (
                              <Popconfirm
                                title="Cancel this order?"
                                description="Are you sure you want to mark this order as cancelled?"
                                okText="Yes, Cancel"
                                cancelText="No"
                                onConfirm={() => handleStatusChange(order.id, "Cancelled")}
                              >
                                <Button size="small" shape="round" danger icon={<CloseCircleOutlined />}>
                                  Cancel
                                </Button>
                              </Popconfirm>
                            )}

                            <Popconfirm
                              title="Delete this order permanently?"
                              description="This order record will be removed completely."
                              okText="Delete"
                              okType="danger"
                              cancelText="Cancel"
                              onConfirm={() => handleDelete(order.id)}
                            >
                              <Button size="small" shape="round" danger icon={<DeleteOutlined />}>
                                Delete
                              </Button>
                            </Popconfirm>
                          </Flex>
                        </div>
                      </MobileOrderQueueCard>
                    );
                  })}

                  {filteredOrders.length > mobilePageSize && (
                    <Flex justify="center" style={{ marginTop: 12, marginBottom: 4 }}>
                      <Pagination
                        simple
                        size="small"
                        current={mobilePage}
                        total={filteredOrders.length}
                        pageSize={mobilePageSize}
                        onChange={(page) => setMobilePage(page)}
                      />
                    </Flex>
                  )}
                </Flex>
              )}
            </Spin>
          )}
        </OrdersCard>
      </Wrapper>
    </>
  );
};

export default AdminOrders;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "@src/store";
import {
  deleteOrderRequest,
  updateOrderStatusRequest,
  fetchOrdersRequest,
} from "@src/store/slices/orderSlice";
import { OrdersCard } from "./styles";
import { getOrderColumns } from "./components/orderTableColumns";
import StyledPageHeader from "@src/components/PageHeader";
import { StyledInput } from "@src/components/StyledInput";
import { Wrapper } from "@src/components/Wrapper";

const AdminOrders: React.FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const loading = useSelector((state: RootState) => state.orders.loading);
  const [search, setSearch] = useState("");

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

  return (
    <>
      <StyledPageHeader
        title="Customer Orders"
        breadcrumbs={[{ title: "Admin" }, { title: "Orders" }]}
      />
      <Wrapper>
        <OrdersCard
          variant="borderless"
          title="Customers Orders Details"
          extra={
            <StyledInput
              placeholder="Search..."
              allowClear
              suffix={<SearchOutlined />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          }
        >
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredOrders}
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 900 }}
          />
        </OrdersCard>
      </Wrapper>
    </>
  );
};

export default AdminOrders;

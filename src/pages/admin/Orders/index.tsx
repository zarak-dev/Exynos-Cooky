import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../../store";
import {
  deleteOrderRequest,
  updateOrderStatusRequest,
  fetchOrdersRequest,
} from "../../../store/slices/orderSlice";
import { OrdersCard } from "./styles";
import { getOrderColumns } from "./components/orderTableColumns";
import StyledPageHeader from "../../../components/PageHeader";
import { StyledInput } from "../../../components/StyledInput";
import { Wrapper } from "../../../components/Wrapper";

const AdminOrders: React.FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const loading = useSelector((state: RootState) => state.orders.loading);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchOrdersRequest());
  }, [dispatch]);

  const columns = getOrderColumns({
    onStatusChange: (id, status) =>
      dispatch(updateOrderStatusRequest({ id, status })),
    onDelete: (id) => dispatch(deleteOrderRequest(id)),
  });

  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase()),
  );

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

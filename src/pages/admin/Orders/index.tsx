import React from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../../store";
import {
  deleteOrder,
  updateOrderStatus,
} from "../../../store/slices/orderSlice";
import { StyledTitle } from "../../../components/StyledTitle";
import { OrdersCard, OrdersContainer } from "./styles";
import { getOrderColumns } from "./components/orderTableColumns";

const AdminOrders: React.FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.orders.orders);

  const columns = getOrderColumns({
    onStatusChange: (id, status) => dispatch(updateOrderStatus({ id, status })),
    onDelete: (id) => dispatch(deleteOrder(id)),
  });

  return (
    <OrdersContainer>
      <StyledTitle level={1}>CUSTOMER ORDERS STREAM</StyledTitle>

      <OrdersCard variant="borderless">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={orders}
          pagination={false}
          scroll={{ x: 900 }}
        />
      </OrdersCard>
    </OrdersContainer>
  );
};

export default AdminOrders;

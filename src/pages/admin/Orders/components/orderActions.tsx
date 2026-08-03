import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { type Order } from "../../../../store/slices/orderSlice";
import { Wrapper } from "../../../../components/Wrapper";
import { CompleteText, StatusActionContainer } from "../styles";

type Props = {
  order: Order;
  buttonLabel?: string;
  nextStatus?: Order["status"];
  onStatusChange: (id: string, status: Order["status"]) => void;
  onDelete: (id: string) => void;
};

const OrderActions = ({
  order,
  buttonLabel,
  nextStatus,
  onStatusChange,
  onDelete,
}: Props) => (
  <Wrapper>
    <StatusActionContainer>
      {order.status === "Delivered" ? (
        <CompleteText>Complete ✓</CompleteText>
      ) : (
        <Button
          type="primary"
          size="small"
          block
          onClick={() => onStatusChange(order.id, nextStatus!)}
        >
          {buttonLabel}
        </Button>
      )}
    </StatusActionContainer>

    <Popconfirm
      title="Delete Order"
      description={`Delete order ${order.id}?`}
      onConfirm={() => onDelete(order.id)}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
    >
      <Button type="text" danger icon={<DeleteOutlined />} />
    </Popconfirm>
  </Wrapper>
);

export default OrderActions;

import { Button, Popconfirm, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { type Order } from "../../../../store/slices/orderSlice";
import { CompleteText } from "../styles";

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
  <Space>
    {order.status === "Delivered" ? (
      <CompleteText>Complete ✓</CompleteText>
    ) : (
      <Button
        type="primary"
        size="small"
        onClick={() => onStatusChange(order.id, nextStatus!)}
      >
        {buttonLabel}
      </Button>
    )}

    <Popconfirm
      title="Delete Order"
      description={`Delete order ${order.id}?`}
      onConfirm={() => onDelete(order.id)}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: true }}
    >
      <Button type="text" danger size="small" icon={<DeleteOutlined />} />
    </Popconfirm>
  </Space>
);

export default OrderActions;

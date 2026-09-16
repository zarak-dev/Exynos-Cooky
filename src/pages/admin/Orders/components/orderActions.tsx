import { Button, Popconfirm, Space, Tag } from "antd";
import { CloseCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { type Order } from "@src/store/slices/orderSlice";

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
}: Props) => {
  const isCancellable =
    order.status !== "Cancelled" && order.status !== "Delivered";

  return (
    <Space size="small">
      {order.status === "Delivered" && (
        <Tag color="green">Complete</Tag>
      )}

      {order.status === "Cancelled" && (
        <Tag color="red">Cancelled</Tag>
      )}

      {order.status !== "Delivered" && order.status !== "Cancelled" && buttonLabel && nextStatus && (
        <Button
          type="primary"
          size="small"
          shape="round"
          onClick={() => onStatusChange(order.id, nextStatus)}
        >
          {buttonLabel}
        </Button>
      )}

      {isCancellable && (
        <Popconfirm
          title="Cancel Order"
          description={`Cancel order ${order.id} and return cookies to stock?`}
          onConfirm={() => onStatusChange(order.id, "Cancelled")}
          okText="Cancel Order"
          cancelText="Keep"
          okButtonProps={{ danger: true }}
        >
          <Button
            shape="round"
            type="default"
            danger
            size="small"
            icon={<CloseCircleOutlined />}
          >
            Cancel
          </Button>
        </Popconfirm>
      )}

      <Popconfirm
        title="Delete Order Record"
        description={`Permanently purge order ${order.id} from database?`}
        onConfirm={() => onDelete(order.id)}
        okText="Purge"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <Button
          shape="circle"
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          title="Delete record"
        />
      </Popconfirm>
    </Space>
  );
};

export default OrderActions;

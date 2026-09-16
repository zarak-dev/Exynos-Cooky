import { Button, Popconfirm, Flex, Tag } from "antd";
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
    <Flex align="center" gap={6} style={{ flexWrap: "nowrap" }}>
      {order.status === "Delivered" && (
        <Tag color="success" style={{ borderRadius: 6, fontWeight: 600, margin: 0 }}>
          Completed
        </Tag>
      )}

      {order.status === "Cancelled" && (
        <Tag color="error" style={{ borderRadius: 6, fontWeight: 600, margin: 0 }}>
          Cancelled
        </Tag>
      )}

      {order.status !== "Delivered" &&
        order.status !== "Cancelled" &&
        buttonLabel &&
        nextStatus && (
          <Button
            type="primary"
            size="small"
            shape="round"
            style={{
              background: "#00009c",
              borderColor: "#00009c",
              fontWeight: 600,
              fontSize: 12,
              height: 28,
              padding: "0 10px",
            }}
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
            icon={<CloseCircleOutlined style={{ fontSize: 12 }} />}
            style={{ height: 28, fontSize: 12, padding: "0 8px" }}
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
          icon={<DeleteOutlined style={{ fontSize: 13 }} />}
          title="Delete record"
          style={{ width: 28, height: 28 }}
        />
      </Popconfirm>
    </Flex>
  );
};

export default OrderActions;

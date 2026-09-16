import { Avatar, Button, Flex, Popconfirm, Tag, Typography } from "antd";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UserHistoryRow } from "@src/store/slices/userHistorySlice";

const { Text } = Typography;

export const getUserHistoryColumns = (
  onDelete: (uuid: string) => void,
): ColumnsType<UserHistoryRow> => [
  {
    title: "Avatar",
    width: 65,
    render: (_, user) => (
      <Avatar src={user.thumbnail} icon={<UserOutlined />} size={38} style={{ border: "1px solid #e0e7ff" }} />
    ),
  },
  {
    title: "Name",
    width: "22%",
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (_, user) => (
      <Flex vertical>
        <Text strong style={{ color: "#0f172a" }}>{user.name}</Text>
        <Text type="secondary" style={{ fontSize: "0.8rem", textTransform: "capitalize" }}>
          {user.gender}
        </Text>
      </Flex>
    ),
  },
  {
    title: "Email",
    dataIndex: "email",
    width: "28%",
    ellipsis: true,
    sorter: (a, b) => a.email.localeCompare(b.email),
    render: (email: string) => (
      <a href={`mailto:${email}`} style={{ color: "#00009c" }}>
        {email}
      </a>
    ),
  },
  {
    title: "Phone",
    dataIndex: "phone",
    width: "18%",
    render: (phone: string) => (
      <Text style={{ color: "#475569" }}>{phone}</Text>
    ),
  },
  {
    title: "Location",
    dataIndex: "country",
    width: "14%",
    sorter: (a, b) => a.country.localeCompare(b.country),
    filters: [],
    render: (country: string) => <Tag color="blue" style={{ borderRadius: 6 }}>{country}</Tag>,
  },
  {
    title: "Action",
    width: 70,
    render: (_, user) => (
      <Popconfirm
        title="Delete this customer?"
        description="This action cannot be undone."
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
        onConfirm={() => onDelete(user.uuid)}
      >
        <Button size="small" type="text" danger icon={<DeleteOutlined />} />
      </Popconfirm>
    ),
  },
];

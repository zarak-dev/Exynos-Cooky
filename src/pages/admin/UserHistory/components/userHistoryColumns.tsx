import { Avatar, Flex, Tag, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Text } = Typography;

export interface UserHistoryRow {
  uuid: string;
  index: number;
  name: string;
  email: string;
  country: string;
  thumbnail: string;
}

export const userHistoryColumns: ColumnsType<UserHistoryRow> = [
  {
    title: "#",
    dataIndex: "index",
    width: 70,
    render: (index: number) => <Text type="secondary">{index}</Text>,
  },
  {
    title: "Customer",
    render: (_, user) => (
      <Flex align="center" gap="middle">
        <Avatar src={user.thumbnail} icon={<UserOutlined />} />
        <Text strong>{user.name}</Text>
      </Flex>
    ),
  },
  {
    title: "Email Address",
    dataIndex: "email",
  },
  {
    title: "Location",
    dataIndex: "country",
    render: (country: string) => <Tag color="blue">{country}</Tag>,
  },
];

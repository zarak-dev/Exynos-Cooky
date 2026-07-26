import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Avatar, Tag, Typography, Flex } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { type RootState } from "../../../../../store";
import { fetchUsersStart } from "../../../../../store/slices/userHistorySlice";
import { HistoryCardWrapper, SearchContainer } from "./styles";

const { Text } = Typography;

export const UserHistory: React.FC = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(
    (state: RootState) => state.userHistory,
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchUsersStart());
  }, [dispatch]);

  // Memoize filtered users for performance so it only rcalculates when search or data changes
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    const lowerCaseSearch = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerCaseSearch) ||
        user.index.toString().includes(lowerCaseSearch),
    );
  }, [users, searchTerm]);

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: 70,
      render: (text: number) => <Text type="secondary">{text}</Text>,
    },
    {
      title: "Customer",
      key: "customer",
      render: (_: any, record: any) => (
        <Flex gap="middle" align="center">
          <Avatar src={record.thumbnail} icon={<UserOutlined />} />
          <Text strong>{record.name}</Text>
        </Flex>
      ),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Location",
      dataIndex: "country",
      key: "country",
      render: (country: string) => <Tag color="blue">{country}</Tag>,
    },
  ];

  return (
    <HistoryCardWrapper title="Customer History & Directory">
      <SearchContainer>
        <Input.Search
          placeholder="Search by customer name or index..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="uuid"
        loading={loading}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} customers`,
        }}
        scroll={{ x: 800 }}
      />
    </HistoryCardWrapper>
  );
};

export default UserHistory;

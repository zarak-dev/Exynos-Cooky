import React, { useEffect, useMemo, useState } from "react";
import { Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import { type RootState } from "../../../store";
import { fetchUsersStart } from "../../../store/slices/userHistorySlice";
import { HistoryCardWrapper, SearchInput } from "./styles";
import { userHistoryColumns } from "./components/userHistoryColumns";

const UserHistory: React.FC = () => {
  const dispatch = useDispatch();

  const { users, loading } = useSelector(
    (state: RootState) => state.userHistory,
  );

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchUsersStart());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return users;

    return users.filter(
      ({ name, index }) =>
        name.toLowerCase().includes(query) || index.toString().includes(query),
    );
  }, [users, searchTerm]);

  return (
    <HistoryCardWrapper title="Customer History & Directory">
        
        <SearchInput
          placeholder="Search by customer name or index..."
          allowClear
          size="medium"
          enterButton={<SearchOutlined />}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
  

      <Table
        rowKey="uuid"
        columns={userHistoryColumns}
        dataSource={filteredUsers}
        loading={loading}
        scroll={{ x: 800 }}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} customers`,
        }}
      />
    </HistoryCardWrapper>
  );
};

export default UserHistory;

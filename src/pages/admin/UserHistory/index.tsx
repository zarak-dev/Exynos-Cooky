import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Table, Button, Input, message } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import { type RootState } from "@src/store";
import {
  fetchUsersStart,
  deleteUser,
} from "@src/store/slices/userHistorySlice";
import { HistoryCardWrapper } from "./styles";
import { getUserHistoryColumns } from "./components/columnData";
import StyledPageHeader from "@src/components/PageHeader";
import { Wrapper } from "@src/components/Wrapper";
import HistoryModal from "./components/historyModal";

const UserHistory: React.FC = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const { users, loading } = useSelector(
    (state: RootState) => state.userHistory,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (users.length === 0) {
      dispatch(fetchUsersStart());
    }
  }, [dispatch, users.length]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return users;
    return users.filter(
      ({ name, email }) =>
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query),
    );
  }, [users, searchTerm]);

  const handleDelete = useCallback(
    (uuid: string) => {
      dispatch(deleteUser(uuid));
      messageApi.success("Customer removed.");
    },
    [dispatch, messageApi],
  );

  const columns = useMemo(
    () => getUserHistoryColumns(handleDelete),
    [handleDelete],
  );

  return (
    <>
      {contextHolder}

      <StyledPageHeader
        title="Customer History"
        breadcrumbs={[{ title: "Admin" }, { title: "Customer History" }]}
        extra={
          <Button
            type="primary"
            shape="round"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
          >
            Add Customer
          </Button>
        }
      />
      <Wrapper>
        <HistoryCardWrapper
          title="Customer Details"
          extra={
            <Input
              allowClear
              value={searchTerm}
              placeholder="Search..."
              suffix={<SearchOutlined />}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          }
        >
          <Table
            rowKey="uuid"
            columns={columns}
            dataSource={filteredUsers}
            loading={loading}
            pagination={{
              defaultPageSize: 20,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} customers`,
            }}
          />
        </HistoryCardWrapper>
      </Wrapper>

      <HistoryModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        messageApi={messageApi}
      />
    </>
  );
};

export default UserHistory;

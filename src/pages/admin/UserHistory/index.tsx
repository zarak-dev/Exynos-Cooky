import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Table, Button, Flex, Typography, Tag, Avatar, Popconfirm, Pagination, Empty, Spin, message } from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined, UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import { type RootState } from "@src/store";
import {
  fetchUsersStart,
  deleteUser,
} from "@src/store/slices/userHistorySlice";
import { HistoryCardWrapper, MobileCustomerCard, ResponsiveToolbar } from "./styles";
import { getUserHistoryColumns } from "./components/columnData";
import StyledPageHeader from "@src/components/PageHeader";
import { StyledInput } from "@src/components/StyledInput";
import { Wrapper } from "@src/components/Wrapper";
import { useMediaQuery } from "@src/hooks/useMediaQuery";
import HistoryModal from "./components/historyModal";

const { Text } = Typography;

const UserHistory: React.FC = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { users, loading } = useSelector(
    (state: RootState) => state.userHistory,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [mobilePage, setMobilePage] = useState(1);
  const mobilePageSize = 6;

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

  const paginatedMobileUsers = useMemo(() => {
    return filteredUsers.slice(
      (mobilePage - 1) * mobilePageSize,
      mobilePage * mobilePageSize,
    );
  }, [filteredUsers, mobilePage]);

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
        <HistoryCardWrapper>
          {/* Responsive Header Toolbar */}
          <ResponsiveToolbar>
            <span className="title-text">Customer Records ({filteredUsers.length})</span>
            <div className="search-input">
              <StyledInput
                allowClear
                value={searchTerm}
                placeholder="Search by name or email..."
                suffix={<SearchOutlined />}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setMobilePage(1);
                }}
              />
            </div>
          </ResponsiveToolbar>

          {isDesktop ? (
            /* DESKTOP TABLE VIEW */
            <Table
              rowKey="uuid"
              tableLayout="fixed"
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
          ) : (
            /* MOBILE RESPONSIVE CARD VIEW */
            <Spin spinning={loading}>
              {filteredUsers.length === 0 ? (
                <Empty description="No customers matching search" style={{ padding: "32px 0" }} />
              ) : (
                <Flex vertical gap={4}>
                  {paginatedMobileUsers.map((user) => (
                    <MobileCustomerCard key={user.uuid}>
                      {/* Customer Header: Avatar, Name, Gender, Country, Delete */}
                      <Flex justify="space-between" align="flex-start" gap={10}>
                        <Flex align="center" gap={12}>
                          <Avatar
                            src={user.thumbnail}
                            icon={<UserOutlined />}
                            size={46}
                            style={{ flexShrink: 0, border: "2px solid #e0e7ff" }}
                          />
                          <Flex vertical>
                            <Text strong style={{ fontSize: 15, color: "#09090b" }}>
                              {user.name}
                            </Text>
                            <Flex gap={6} align="center" style={{ marginTop: 2 }}>
                              {user.gender && (
                                <Tag style={{ margin: 0, fontSize: 11, textTransform: "capitalize" }}>
                                  {user.gender}
                                </Tag>
                              )}
                              {user.country && (
                                <Tag color="blue" style={{ margin: 0, fontSize: 11 }}>
                                  {user.country}
                                </Tag>
                              )}
                            </Flex>
                          </Flex>
                        </Flex>

                        <Popconfirm
                          title="Delete this customer?"
                          description="This action cannot be undone."
                          okText="Delete"
                          okType="danger"
                          cancelText="Cancel"
                          onConfirm={() => handleDelete(user.uuid)}
                        >
                          <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </Flex>

                      {/* Contact Info: Email & Phone */}
                      <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #f1f5f9" }}>
                        <Flex vertical gap={6}>
                          {user.email && (
                            <Flex align="center" gap={8}>
                              <MailOutlined style={{ color: "#64748b", fontSize: 13 }} />
                              <a
                                href={`mailto:${user.email}`}
                                style={{ color: "#00009c", fontSize: 13, wordBreak: "break-all" }}
                              >
                                {user.email}
                              </a>
                            </Flex>
                          )}
                          {user.phone && (
                            <Flex align="center" gap={8}>
                              <PhoneOutlined style={{ color: "#64748b", fontSize: 13 }} />
                              <a
                                href={`tel:${user.phone}`}
                                style={{ color: "#475569", fontSize: 13 }}
                              >
                                {user.phone}
                              </a>
                            </Flex>
                          )}
                        </Flex>
                      </div>
                    </MobileCustomerCard>
                  ))}

                  {filteredUsers.length > mobilePageSize && (
                    <Flex justify="center" style={{ marginTop: 12, marginBottom: 4 }}>
                      <Pagination
                        simple
                        size="small"
                        current={mobilePage}
                        total={filteredUsers.length}
                        pageSize={mobilePageSize}
                        onChange={(page) => setMobilePage(page)}
                      />
                    </Flex>
                  )}
                </Flex>
              )}
            </Spin>
          )}
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

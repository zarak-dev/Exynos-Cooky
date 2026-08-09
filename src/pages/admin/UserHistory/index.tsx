import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Radio,
  Avatar,
  Flex,
  message,
} from "antd";
import { SearchOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { type RootState } from "../../../store";
import {
  fetchUsersStart,
  addUser,
  deleteUser,
} from "../../../store/slices/userHistorySlice";
import { HistoryCardWrapper, SearchWrapper } from "./styles";
import { getUserHistoryColumns } from "./components/userHistoryColumns";
import StyledPageHeader from "../../../components/PageHeader";
import { StyledInput } from "../../../components/StyledInput";

const UserHistory: React.FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { users, loading } = useSelector((state: RootState) => state.userHistory);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    dispatch(fetchUsersStart());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return users;
    return users.filter(
      ({ name, email }) =>
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query)
    );
  }, [users, searchTerm]);

  const handleAdd = () => {
    form.validateFields().then((values) => {
      dispatch(
        addUser({
          uuid: uuidv4(),
          index: 0,
          name: values.name,
          email: values.email,
          phone: values.phone,
          gender: values.gender,
          country: values.location,
          thumbnail: values.avatar || "",
        })
      );
      messageApi.success(`${values.name} added successfully!`);
      form.resetFields();
      setAvatarPreview("");
      setModalOpen(false);
    });
  };

  const handleDelete = (uuid: string) => {
    dispatch(deleteUser(uuid));
    messageApi.success("Customer removed.");
  };

  const columns = getUserHistoryColumns(handleDelete);

  return (
    <>
      {contextHolder}

      <StyledPageHeader
        title="Customer History"
        breadcrumbs={[{ title: "Admin" }, { title: "Customer History" }]}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
          >
            Add Customer
          </Button>
        }
      />

      <SearchWrapper>
        <StyledInput
          placeholder="Search by name or email..."
          allowClear
          suffix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchWrapper>

      <HistoryCardWrapper>
        <Table
          rowKey="uuid"
          columns={columns}
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

      <Modal
        title="Add New Customer"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setAvatarPreview("");
        }}
        onOk={handleAdd}
        okText="Add Customer"
        width={480}
        centered
      >
        <Flex vertical gap={16}>
          <Flex justify="center">
            <Avatar
              size={72}
              src={avatarPreview || undefined}
              icon={<UserOutlined />}
            />
          </Flex>

          <Form form={form} layout="vertical">
            <Form.Item
              name="avatar"
              label="Avatar URL"
            >
              <Input
                placeholder="Paste image URL (optional)"
                onChange={(e) => setAvatarPreview(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input placeholder="e.g. John Doe" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input placeholder="e.g. john@example.com" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: "Phone is required" }]}
            >
              <Input placeholder="e.g. +92 300 1234567" />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: "Gender is required" }]}
            >
              <Radio.Group>
                <Radio value="Male">Male</Radio>
                <Radio value="Female">Female</Radio>
                <Radio value="Other">Other</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: "Location is required" }]}
            >
              <Input placeholder="e.g. Islamabad, Pakistan" />
            </Form.Item>
          </Form>
        </Flex>
      </Modal>
    </>
  );
};

export default UserHistory;
import React, { useState } from "react";
import { Avatar, Button, Flex, Form, Input, Modal, Radio } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { addUser } from "../../../../../store/slices/userHistorySlice";
import { v4 as uuidv4 } from "uuid";

const HistoryModal: React.FC = ({
  dispatch,
  modalOpen,
  setModalOpen,
  messageApi,
}: any) => {
  const [form] = Form.useForm();
  const [avatarPreview, setAvatarPreview] = useState("");

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
        }),
      );
      messageApi.success(`${values.name} added successfully!`);
      form.resetFields();
      setAvatarPreview("");
      setModalOpen(false);
    });
  };

  return (
    <Modal
      title="Add New Customer"
      open={modalOpen}
      width={600}
      closable={false}
      centered
      footer={[
        <Button
          type="primary"
          shape="round"
          ghost
          onClick={() => {
            setModalOpen(false);
            form.resetFields();
            setAvatarPreview("");
          }}
        >
          Cancel
        </Button>,
        <Button type="primary" shape="round" onClick={handleAdd}>
          Add Customer
        </Button>,
      ]}
    >
      <Flex vertical gap={16}>
        <Form form={form} layout="vertical">
          <Form.Item name="avatar" label="Avatar URL">
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
            <Input.TextArea placeholder="e.g. Islamabad, Pakistan" />
          </Form.Item>
        </Form>
      </Flex>
    </Modal>
  );
};

export default HistoryModal;

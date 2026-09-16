import React from "react";
import { Modal, Form, Input, Switch } from "antd";
import type { AddressInput } from "@src/types/address";

interface AddAddressModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: AddressInput) => void;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
  open,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: AddressInput) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Add Delivery Address"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Add Address"
      centered
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ isDefault: false }}
      >
        <Form.Item
          name="recipientName"
          label="Recipient Name"
          rules={[{ required: true, message: "Please specify recipient name" }]}
        >
          <Input placeholder="e.g. John Doe" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: "Please specify contact phone" }]}
        >
          <Input placeholder="+92 300 1234567" />
        </Form.Item>

        <Form.Item
          name="addressLine1"
          label="Street Address / House No."
          rules={[{ required: true, message: "Please specify address" }]}
        >
          <Input placeholder="House 12, Street 4, Block B" />
        </Form.Item>

        <Form.Item
          name="city"
          label="City"
          rules={[{ required: true, message: "Please specify city" }]}
        >
          <Input placeholder="Lahore, Karachi, Islamabad..." />
        </Form.Item>

        <Form.Item
          name="postalCode"
          label="Postal Code"
        >
          <Input placeholder="54000" />
        </Form.Item>

        <Form.Item
          name="isDefault"
          label="Set as default address"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

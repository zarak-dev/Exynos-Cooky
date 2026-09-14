import React, { useEffect } from "react";
import { Modal, Form, Input } from "antd";

interface EditContactModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: { name: string; phone: string }) => void;
  initialValues: { name: string; phone?: string };
}

export const EditContactModal: React.FC<EditContactModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        name: initialValues.name,
        phone: initialValues.phone || "",
      });
    }
  }, [open, initialValues, form]);

  const handleFinish = (values: { name: string; phone: string }) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Edit Contact Information"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Save"
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <Input placeholder="Your Name" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: "Please enter your phone number" }]}
        >
          <Input placeholder="+92 300 1234567" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

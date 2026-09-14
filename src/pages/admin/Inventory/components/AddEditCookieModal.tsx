import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Switch } from "antd";
import type { Product, ProductCategory } from "../../../../types/product";

interface AddEditCookieModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Product, "id">, id?: number) => void;
  initialValues?: Product | null;
  loading?: boolean;
}

const CATEGORY_OPTIONS: Array<{ label: string; value: ProductCategory }> = [
  { label: "Classic", value: "classic" },
  { label: "Velvet & Fruit", value: "velvet_fruit" },
  { label: "Specialty", value: "specialty" },
  { label: "Chocolate", value: "chocolate" },
];

export const AddEditCookieModal: React.FC<AddEditCookieModalProps> = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();
  const isEditing = Boolean(initialValues);

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          name: initialValues.name,
          price: initialValues.price,
          stock: initialValues.stock,
          description: initialValues.description,
          imageUrl: initialValues.imageUrl,
          category: initialValues.category || "classic",
          isAvailable: initialValues.isAvailable,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          isAvailable: true,
          category: "classic",
          stock: 15,
          price: 1290,
          imageUrl:
            "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80&auto=format&fit=crop",
        });
      }
    }
  }, [open, initialValues, form]);

  const handleFinish = (values: Omit<Product, "id">) => {
    onSubmit(values, initialValues?.id);
    form.resetFields();
  };

  return (
    <Modal
      title={isEditing ? `Edit "${initialValues?.name}"` : "Add New Cookie"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText={isEditing ? "Save Changes" : "Add to Inventory"}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Cookie Name"
          rules={[{ required: true, message: "Please enter a cookie name" }]}
        >
          <Input placeholder="e.g. Lotus Biscoff Lava" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price (Rs.)"
          rules={[{ required: true, message: "Please specify price" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="stock"
          label="Stock Quantity"
          rules={[{ required: true, message: "Please specify initial stock" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="category" label="Flavor Category">
          <Select options={CATEGORY_OPTIONS} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter product description" }]}
        >
          <Input.TextArea rows={3} placeholder="Describe the cookie flavor, texture, and notes..." />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label="Image URL"
          rules={[{ required: true, message: "Please provide an image link" }]}
        >
          <Input placeholder="https://images.unsplash.com/..." />
        </Form.Item>

        <Form.Item name="isAvailable" label="Available in Store" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

import React from "react";
import { Form, Input, Button, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { signupRequest } from "../../../../../store/slices/authSlice";
import type { RootState } from "../../../../../store";
import type { SignUpFormValues } from "../../../../../types/auth";

export const SignUpForm: React.FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const onFinish = ({ name, email, password }: SignUpFormValues) => {
    dispatch(
      signupRequest({
        name: name.trim(),
        email: email.trim(),
        password,
      }),
    );
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Form.Item
        name="name"
        label="Full Name"
        rules={[
          { required: true, message: "Please enter your full name" },
          { min: 2, message: "Name must be at least 2 characters" },
        ]}
      >
        <Input placeholder="John Doe" size="large" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email Address"
        rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Please enter a valid email address" },
        ]}
      >
        <Input placeholder="you@example.com" size="large" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: "Please enter your password" },
          { min: 6, message: "Password must be at least 6 characters" },
        ]}
      >
        <Input.Password placeholder="••••••••" size="large" />
      </Form.Item>

      <Button
        type="primary"
        shape="round"
        htmlType="submit"
        block
        size="large"
        loading={loading}
      >
        Create Account
      </Button>
    </Form>
  );
};

import React, { useState } from "react";
import { Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../../store";
import {
  setOpenAuthModal,
  loginUser,
  registerUser,
  ADMIN_EMAIL,
  type UserRole,
} from "../../../store/slices/authSlice";

import {
  AuthTitle,
  StyledForm,
  StyledInput,
  StyledPasswordInput,
  SubmitFormItem,
  StyledButton,
  SwitchTextWrapper,
  ActionText,
} from "./styles";

export const AuthModal: React.FC = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const isOpen = useSelector((state: RootState) => state.auth.isAuthModalOpen);
  const registeredUsers = useSelector(
    (state: RootState) => state.auth.registeredUsers,
  );

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [form] = StyledForm.useForm();

  const handleModalClose = () => {
    dispatch(setOpenAuthModal(false));
    form.resetFields();
    setIsSignUp(false); // Reset back to login on close
  };

  const onFinish = (values: any) => {
    const { email, password, name } = values;
    const trimmedEmail = email.trim();
    const SECRET_ADMIN_PASS = "galaxy98";

    if (isSignUp) {
      const userExists = registeredUsers.some(
        (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase(),
      );

      if (userExists) {
        message.error("This email is already registered. Please log in.");
        return;
      }

      const assignedRole =
        trimmedEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()
          ? "admin"
          : "customer";

      const newUser = {
        name: name || "Valued Guest",
        email: trimmedEmail,
        password: password,
        role: assignedRole as UserRole,
      };

      dispatch(registerUser(newUser));
      message.success("Account created successfully! Please log in.");

      form.resetFields();
      setIsSignUp(false);
    } else {
      if (trimmedEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        if (password !== SECRET_ADMIN_PASS) {
          message.error("Access Denied: Invalid Administrative Password!");
          return;
        }
        dispatch(loginUser({ name: "System Admin", email: trimmedEmail }));
        messageApi.success("Logged in!");
        handleModalClose();
        return;
      }

      const foundUser = registeredUsers.find(
        (u) =>
          u.email.toLowerCase() === trimmedEmail.toLowerCase() &&
          u.password === password,
      );

      if (foundUser) {
        dispatch(loginUser({ name: foundUser.name, email: foundUser.email }));
        message.success(`Welcome back, ${foundUser.name}! 🍪`);
        handleModalClose();
      } else {
        message.error("Invalid email or password. Please try again.");
      }
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <AuthTitle level={2}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </AuthTitle>
        }
        open={isOpen}
        onCancel={handleModalClose}
        footer={null}
        centered
        destroyOnHidden
      >
        <StyledForm
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          {isSignUp && (
            <StyledForm.Item
              name="name"
              label="FULL NAME"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <StyledInput placeholder="John Doe" />
            </StyledForm.Item>
          )}

          <StyledForm.Item
            name="email"
            label="EMAIL ADDRESS"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <StyledInput placeholder="you@example.com" />
          </StyledForm.Item>

          <StyledForm.Item
            name="password"
            label="PASSWORD"
            rules={[
              {
                required: true,
                min: 6,
                message: "Password must be at least 6 characters",
              },
            ]}
          >
            <StyledPasswordInput placeholder="••••••••" />
          </StyledForm.Item>

          <SubmitFormItem>
            <StyledButton type="primary" htmlType="submit">
              {isSignUp ? "Sign Up" : "Log In"}
            </StyledButton>
          </SubmitFormItem>
        </StyledForm>

        <SwitchTextWrapper>
          {isSignUp ? "Already have an account? " : "New to Exynos Cooky? "}
          <ActionText
            onClick={() => {
              setIsSignUp(!isSignUp);
              form.resetFields();
            }}
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </ActionText>
        </SwitchTextWrapper>
      </Modal>
    </>
  );
};

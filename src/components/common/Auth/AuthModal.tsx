import React, { useState } from "react";
import { Input, Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../../store";
import {
  setOpenAuthModal,
  loginUser,
  registerUser,
  ADMIN_EMAIL,
  type UserRole,
} from "../../../store/slices/authSlice";
import { StyledButton } from "../../StyledButton";
import { StyledTitle } from "../../StyledTitle";
import { StyledForm } from "../../StyledForm";
import { StyledInput } from "../../StyledInput";
import { Wrapper } from "../../Wrapper";
import Text from "antd/es/typography/Text";

const { Password } = Input;
const { Item } = StyledForm;

export const AuthModal: React.FC = () => {
  // Hooks
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  // Selector
  const isOpen = useSelector((state: RootState) => state.auth.isAuthModalOpen);
  const registeredUsers = useSelector(
    (state: RootState) => state.auth.registeredUsers,
  );
  // States
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
        (text) => text.email.toLowerCase() === trimmedEmail.toLowerCase(),
      );

      if (userExists) {
        messageApi.error("This email is already registered. Please log in.");
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
      messageApi.success("Account created successfully! Please log in.");

      form.resetFields();
      setIsSignUp(false);
    } else {
      if (trimmedEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        if (password !== SECRET_ADMIN_PASS) {
          messageApi.error("Access Denied: Invalid Administrative Password!");
          return;
        }
        dispatch(loginUser({ name: "System Admin", email: trimmedEmail }));
        messageApi.success("Logged in!");
        handleModalClose();
        return;
      }

      const foundUser = registeredUsers.find(
        (value) =>
          value.email.toLowerCase() === trimmedEmail.toLowerCase() &&
          value.password === password,
      );

      if (foundUser) {
        dispatch(loginUser({ name: foundUser.name, email: foundUser.email }));
        messageApi.success(`Welcome back, ${foundUser.name}! 🍪`);
        handleModalClose();
      } else {
        messageApi.error("Invalid email or password. Please try again.");
      }
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <StyledTitle level={2}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </StyledTitle>
        }
        open={isOpen}
        onCancel={handleModalClose}
        footer={null}
        centered
      >
        <StyledForm
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          {isSignUp && (
            <Item
              name="name"
              label="FULL NAME"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <StyledInput placeholder="John Doe" />
            </Item>
          )}

          <Item
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
          </Item>

          <Item
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
            <Password placeholder="Enter password" />
          </Item>

          <StyledButton>
            <StyledButton type="primary" htmlType="submit">
              {isSignUp ? "Sign Up" : "Log In"}
            </StyledButton>
          </StyledButton>
        </StyledForm>

        <Wrapper>
          {isSignUp ? "Already have an account? " : "New to Exynos Cooky? "}
          <Text
            onClick={() => {
              setIsSignUp(!isSignUp);
              form.resetFields();
            }}
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </Text>
        </Wrapper>
      </Modal>
    </>
  );
};

import { useState } from "react";
import { Modal, Space, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../../store";
import { setOpenAuthModal } from "../../../store/slices/authSlice";

import { LoginForm } from "./components/Login";
import { SignUpForm } from "./components/Signup";

const { Text } = Typography;

export const AuthModal = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(
    (state: RootState) => state.auth.isAuthModalOpen
  );

  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <Modal
      open={isOpen}
      footer={null}
      centered
      title={isSignUp ? "Create Account" : "Welcome Back"}
      onCancel={() => {
        dispatch(setOpenAuthModal(false));
        setIsSignUp(false);
      }}
    >
      {isSignUp ? <SignUpForm /> : <LoginForm />}

      <Space align="center">
        {isSignUp
          ? "Already have an account? "
          : "New here? "}

        <Text onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Login" : "Sign Up"}
        </Text>
      </Space>
    </Modal>
  );
};
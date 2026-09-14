import React, { useState } from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../../store";
import { setOpenAuthModal } from "../../../store/slices/authSlice";
import { LoginForm } from "./components/Login";
import { SignUpForm } from "./components/Signup";
import styled from "styled-components";

const ModalBody = styled.div`
  padding: 12px 4px;
`;

const SignupHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const SignupTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #09090b;
  margin: 0 0 4px 0;
  letter-spacing: -0.02em;
`;

const SignupSubtitle = styled.p`
  font-size: 13.5px;
  color: #71717a;
  margin: 0;
`;

const SwitchFooter = styled.div`
  text-align: center;
  font-size: 13px;
  color: #71717a;
  margin-top: 16px;

  button {
    color: #09090b;
    font-weight: 500;
    text-decoration: underline;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    margin-left: 4px;

    &:hover {
      color: #27272a;
    }
  }
`;

export const AuthModal: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.auth.isAuthModalOpen);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleClose = () => {
    dispatch(setOpenAuthModal(false));
    setIsSignUp(false);
  };

  return (
    <Modal
      open={isOpen}
      footer={null}
      centered
      destroyOnHidden
      width={420}
      styles={{
        body: {
          padding: "16px 20px",
        },
      }}
      onCancel={handleClose}
    >
      <ModalBody>
        {isSignUp ? (
          <div>
            <SignupHeader>
              <SignupTitle>Create an account</SignupTitle>
              <SignupSubtitle>Enter your details below to join Exynos Cooky</SignupSubtitle>
            </SignupHeader>
            <SignUpForm />
            <SwitchFooter>
              Already have an account?
              <button type="button" onClick={() => setIsSignUp(false)}>
                Login
              </button>
            </SwitchFooter>
          </div>
        ) : (
          <LoginForm
            onSwitchToSignup={() => setIsSignUp(true)}
            onSuccess={handleClose}
          />
        )}
      </ModalBody>
    </Modal>
  );
};

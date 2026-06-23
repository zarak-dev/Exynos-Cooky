import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {type RootState } from '../../store';
import { setOpenAuthModal, loginUser } from '../../store/authSlice';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  width: 100%;
  border-radius: 0px;
  background-color: #00009c;
  border-color: #00009c;
  font-weight: 700;
  text-transform: uppercase;
  height: 45px;

  &:hover, &:focus {
    background-color: #000066 !important;
    border-color: #000066 !important;
  }
`;

const SwitchText = styled.p`
  text-align: center;
  margin-top: 16px;
  font-size: 0.85rem;
  color: #666;
  span {
    color: #00009c;
    font-weight: 700;
    cursor: pointer;
    &:hover { text-decoration: underline; }
  }
`;

export const AuthModal: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.auth.isAuthModalOpen);
  const [isSignUp, setIsSignUp] = useState<boolean>(true); // Toggles between Sign Up and Login layouts
  
  const onFinish = (values: any) => {
  const { email, password, name } = values;
  const ADMIN_EMAIL = "admin@exynoscooky.com";
  const SECRET_ADMIN_PASS = "galaxy98"; // Our local prototype master password

  // Check if they are trying to log into the administrative portal
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    if (password !== SECRET_ADMIN_PASS) {
      // Bounces them out if the password doesn't match our system secret
      message.error("Access Denied: Invalid Administrative Password!");
      return;
    }
  }

  // If password checks pass (or it's a regular customer), log them in smoothly
  dispatch(loginUser({ 
    name: name || (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'System Admin' : 'Valued Guest'), 
    email: email 
  }));
  
  message.success("Logged in successfully! 🍪");
};

  return (
    <Modal
      title={<h2 style={{ color: '#00009c', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center', margin: 0 }}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>}
      open={isOpen}
      onCancel={() => dispatch(setOpenAuthModal(false))}
      footer={null}
      centered
      destroyOnClose

    >
      <Form layout="vertical" onFinish={onFinish} requiredMark={false} style={{ marginTop: '24px' }}>
        {isSignUp && (
          <Form.Item name="name" label="FULL NAME" rules={[{ required: true, message: 'Please enter your name' }]}>
            <Input style={{ borderRadius: 0, height: '40px' }} placeholder="John Doe" />
          </Form.Item>
        )}

        <Form.Item name="email" label="EMAIL ADDRESS" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
          <Input style={{ borderRadius: 0, height: '40px' }} placeholder="you@example.com" />
        </Form.Item>

        <Form.Item name="password" label="PASSWORD" rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}>
          <Input.Password style={{ borderRadius: 0, height: '40px' }} placeholder="••••••••" />
        </Form.Item>

        <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
          <StyledButton type="primary" htmlType="submit">
            {isSignUp ? 'Sign Up' : 'Log In'}
          </StyledButton>
        </Form.Item>
      </Form>

      <SwitchText>
        {isSignUp ? "Already have an account? " : "New to Exynos Cooky? "}
        <span onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Log In' : 'Sign Up'}
        </span>
      </SwitchText>
    </Modal>
  );
};
import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../../../store';
import { setOpenAuthModal, loginUser } from '../../../store/slices/authSlice';

import {
  AuthTitle,
  StyledForm,
  StyledInput,
  StyledPasswordInput,
  SubmitFormItem,
  StyledButton,
  SwitchTextWrapper,
  ActionText
} from './styles';

export const AuthModal: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.auth.isAuthModalOpen);
  const [isSignUp, setIsSignUp] = useState<boolean>(true); 
  
  const onFinish = (values: any) => {
    const { email, password, name } = values;
    const ADMIN_EMAIL = "admin@exynoscooky.com";
    const SECRET_ADMIN_PASS = "galaxy98"; 

    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      if (password !== SECRET_ADMIN_PASS) {
        message.error("Access Denied: Invalid Administrative Password!");
        return;
      }
    }

    dispatch(loginUser({ 
      name: name || (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'System Admin' : 'Valued Guest'), 
      email: email 
    }));
    
    message.success("Logged in successfully! 🍪");
  };

  return (
    <Modal
      title={<AuthTitle level={2}>{isSignUp ? 'Create Account' : 'Welcome Back'}</AuthTitle>}
      open={isOpen}
      onCancel={() => dispatch(setOpenAuthModal(false))}
      footer={null}
      centered
      destroyOnHidden
    >
      <StyledForm layout="vertical" onFinish={onFinish} requiredMark={false}>
        {isSignUp && (
          <StyledForm.Item name="name" label="FULL NAME" rules={[{ required: true, message: 'Please enter your name' }]}>
            <StyledInput placeholder="John Doe" />
          </StyledForm.Item>
        )}

        <StyledForm.Item name="email" label="EMAIL ADDRESS" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}>
          <StyledInput placeholder="you@example.com" />
        </StyledForm.Item>

        <StyledForm.Item name="password" label="PASSWORD" rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}>
          <StyledPasswordInput placeholder="••••••••" />
        </StyledForm.Item>

        <SubmitFormItem>
          <StyledButton type="primary" htmlType="submit">
            {isSignUp ? 'Sign Up' : 'Log In'}
          </StyledButton>
        </SubmitFormItem>
      </StyledForm>

      <SwitchTextWrapper>
        {isSignUp ? "Already have an account? " : "New to Exynos Cooky? "}
        <ActionText onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Log In' : 'Sign Up'}
        </ActionText>
      </SwitchTextWrapper>
    </Modal>
  );
};
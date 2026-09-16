import React from "react";
import { Form, Input, Button, Alert, Divider, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  loginRequest,
  loginOAuthRequest,
  resetAuthLoading,
} from "@src/store/slices/authSlice";
import { type RootState } from "@src/store";
import type { LoginFormValues } from "@src/types/auth";
import styled from "styled-components";

interface LoginFormProps {
  onSwitchToSignup?: () => void;
  onSuccess?: () => void;
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #09090b;
  margin: 0 0 4px 0;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 13.5px;
  color: #71717a;
  margin: 0;
`;

const GoogleButton = styled(Button)`
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  font-size: 14px;
  font-weight: 500;
  color: #09090b;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc !important;
    border-color: #cbd5e1 !important;
    color: #09090b !important;
  }
`;

const FormWrapper = styled.div`
  .ant-form-item-label > label {
    width: 100%;
  }
`;

const PasswordLabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ForgotLink = styled.a`
  font-size: 12.5px;
  color: #71717a;
  font-weight: 400;
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: #00009c;
    text-decoration: underline;
  }
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
      color: #00009c;
    }
  }
`;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { loading, oauthLoading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  // Clear any stale loading state whenever the login form mounts
  React.useEffect(() => {
    dispatch(resetAuthLoading());
  }, [dispatch]);

  // Failsafe timer: automatically cancel any stuck loading spinners after 8s
  React.useEffect(() => {
    if (loading || oauthLoading) {
      const timer = setTimeout(() => {
        dispatch(resetAuthLoading());
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [loading, oauthLoading, dispatch]);

  const onFinish = ({ email, password }: LoginFormValues) => {
    dispatch(loginRequest({ email: email.trim(), password }));
  };

  const handleOAuthGoogle = () => {
    dispatch(loginOAuthRequest({ provider: "google" }));
  };

  return (
    <FormContainer>
      <HeaderSection>
        <Title>Welcome back</Title>
        <Subtitle>Sign in with your Google account or email</Subtitle>
      </HeaderSection>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <GoogleButton
        shape="round"
        size="large"
        block
        loading={Boolean(oauthLoading)}
        disabled={Boolean(loading || oauthLoading)}
        onClick={handleOAuthGoogle}
      >
        {!oauthLoading && <GoogleIcon />}
        Login with Google
      </GoogleButton>

      <Divider
        style={{
          margin: "18px 0",
          color: "#71717a",
          fontSize: "12px",
          letterSpacing: "0.05em",
        }}
      >
        OR CONTINUE WITH
      </Divider>

      <FormWrapper>
        <Form<LoginFormValues>
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
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
            label={
              <PasswordLabelWrapper>
                <span>Password</span>
                <ForgotLink
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    message.info(
                      "Password reset link sent to your registered email address.",
                    );
                  }}
                >
                  Forgot your password?
                </ForgotLink>
              </PasswordLabelWrapper>
            }
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>

          <Button
            type="primary"
            shape="round"
            htmlType="submit"
            block
            size="large"
            loading={Boolean(loading)}
            disabled={Boolean(oauthLoading)}
            style={{ marginTop: 6 }}
          >
            Login
          </Button>
        </Form>
      </FormWrapper>

      <SwitchFooter>
        Don't have an account?
        <button
          type="button"
          onClick={() => {
            if (onSwitchToSignup) onSwitchToSignup();
          }}
        >
          Sign up
        </button>
      </SwitchFooter>
    </FormContainer>
  );
};

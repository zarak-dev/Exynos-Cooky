import React, { useState } from "react";
import { Alert, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../../../../../store/slices/authSlice";
import { type RootState } from "../../../../../store";
import styled from "styled-components";

interface LoginFormProps {
  onSwitchToSignup?: () => void;
  onSuccess?: () => void;
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const HeaderSection = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #09090b;
  margin: 0;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 13.5px;
  color: #71717a;
  margin: 0;
`;

const SocialButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SocialButton = styled.button`
  width: 100%;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 500;
  color: #09090b;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f4f4f5;
    border-color: #d4d4d8;
  }
`;

const Divider = styled.div`
  position: relative;
  text-align: center;
  margin: 4px 0;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e4e4e7;
    z-index: 0;
  }
`;

const DividerText = styled.span`
  position: relative;
  z-index: 1;
  background: #ffffff;
  padding: 0 12px;
  font-size: 12px;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.label`
  font-size: 13.5px;
  font-weight: 500;
  color: #09090b;
`;

const ForgotLink = styled.a`
  font-size: 12.5px;
  color: #71717a;
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: #09090b;
    text-decoration: underline;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #e4e4e7;
  background: #ffffff;
  font-size: 14px;
  color: #09090b;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;

  &::placeholder {
    color: #a1a1aa;
  }

  &:focus {
    border-color: #09090b;
    box-shadow: 0 0 0 1px #09090b;
  }
`;

const SubmitButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  height: 40px;
  background: #09090b;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${(props) => (props.$loading ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$loading ? 0.7 : 1)};
  transition: background-color 0.15s ease;
  margin-top: 4px;

  &:hover {
    background: ${(props) => (props.$loading ? "#09090b" : "#27272a")};
  }
`;

const FooterText = styled.div`
  text-align: center;
  font-size: 13px;
  color: #71717a;

  a,
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

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      message.error("Please enter both email and password");
      return;
    }
    dispatch(loginRequest({ email: email.trim(), password }));
  };

  const handleOAuthDemo = (provider: "Apple" | "Google") => {
    message.info(`Demo OAuth: Signing in with ${provider}...`);
    setEmail(provider === "Google" ? "customer@exynoscooky.com" : "apple.user@exynoscooky.com");
    setPassword("password123");
    dispatch(
      loginRequest({
        email: provider === "Google" ? "customer@exynoscooky.com" : "apple.user@exynoscooky.com",
        password: "password123",
      }),
    );
  };

  return (
    <FormContainer>
      <HeaderSection>
        <Title>Welcome back</Title>
        <Subtitle>Login with your Apple or Google account</Subtitle>
      </HeaderSection>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ borderRadius: 8 }}
        />
      )}

      <SocialButtonGroup>
        <SocialButton type="button" onClick={() => handleOAuthDemo("Apple")}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.92.04-2.02.62-2.66 1.37-.56.65-1.06 1.71-.93 2.73 1.03.08 2.06-.5 2.67-1.25z" />
          </svg>
          Login with Apple
        </SocialButton>

        <SocialButton type="button" onClick={() => handleOAuthDemo("Google")}>
          <svg width="17" height="17" viewBox="0 0 24 24">
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
          Login with Google
        </SocialButton>
      </SocialButtonGroup>

      <Divider>
        <DividerText>Or continue with</DividerText>
      </Divider>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <LabelRow>
            <Label htmlFor="login-password">Password</Label>
            <ForgotLink
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                message.info("Password reset link sent to registered email address.");
              }}
            >
              Forgot your password?
            </ForgotLink>
          </LabelRow>
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>

        <SubmitButton type="submit" $loading={loading} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </SubmitButton>

        <FooterText>
          Don't have an account?
          <button
            type="button"
            onClick={() => {
              if (onSwitchToSignup) onSwitchToSignup();
            }}
          >
            Sign up
          </button>
        </FooterText>
      </Form>
    </FormContainer>
  );
};

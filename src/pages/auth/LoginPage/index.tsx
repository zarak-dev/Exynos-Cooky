import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cookie } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@src/store";
import { LoginForm } from "@src/components/common/Auth/components/Login";
import styled from "styled-components";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4f4f5;
  padding: 24px 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const BrandLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  color: #09090b;
  font-weight: 600;
  font-size: 15px;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.85;
  }
`;

const BrandIconBox = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #09090b;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 16px;
  padding: 32px 28px;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);

  @media (max-width: 480px) {
    padding: 24px 20px;
  }
`;

const TermsText = styled.p`
  text-align: center;
  font-size: 12px;
  color: #71717a;
  line-height: 1.5;
  margin: 0;

  a {
    color: #71717a;
    text-decoration: underline;
    text-underline-offset: 4px;
    transition: color 0.15s ease;

    &:hover {
      color: #09090b;
    }
  }
`;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      if (user?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isLoggedIn, user, navigate]);

  return (
    <PageContainer>
      <ContentWrapper>
        {/* Brand Header */}
        <BrandLink to="/">
          <BrandIconBox>
            <Cookie size={16} strokeWidth={2.2} />
          </BrandIconBox>
          <span>Exynos Cooky</span>
        </BrandLink>

        {/* Card Component (shadcn login-03) */}
        <Card>
          <LoginForm
            onSwitchToSignup={() => {
              navigate("/signup");
            }}
          />
        </Card>

        {/* Terms Disclaimer */}
        <TermsText>
          By clicking continue, you agree to our{" "}
          <Link to="/about">Terms of Service</Link> and{" "}
          <Link to="/about">Privacy Policy</Link>.
        </TermsText>
      </ContentWrapper>
    </PageContainer>
  );
};

export default LoginPage;

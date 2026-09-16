import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cookie } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@src/store";
import { SignUpForm } from "@src/components/common/Auth/components/Signup";
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

const SwitchText = styled.div`
  text-align: center;
  font-size: 13px;
  color: #71717a;
  margin-top: 16px;

  a {
    color: #09090b;
    font-weight: 500;
    text-decoration: underline;
    margin-left: 4px;
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

    &:hover {
      color: #09090b;
    }
  }
`;

export const SignupPage: React.FC = () => {
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
        <BrandLink to="/">
          <BrandIconBox>
            <Cookie size={16} strokeWidth={2.2} />
          </BrandIconBox>
          <span>Exynos Cooky</span>
        </BrandLink>

        <Card>
          <HeaderSection>
            <Title>Create an account</Title>
            <Subtitle>Enter your details below to join Exynos Cooky</Subtitle>
          </HeaderSection>
          <SignUpForm />
          <SwitchText>
            Already have an account?
            <Link to="/login">Login</Link>
          </SwitchText>
        </Card>

        <TermsText>
          By clicking continue, you agree to our{" "}
          <Link to="/about">Terms of Service</Link> and{" "}
          <Link to="/about">Privacy Policy</Link>.
        </TermsText>
      </ContentWrapper>
    </PageContainer>
  );
};

export default SignupPage;

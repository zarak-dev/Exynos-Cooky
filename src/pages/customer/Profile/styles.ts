import styled from "styled-components";
import { Tabs, Card, Button, Typography, Flex } from "antd";

const { Title, Text } = Typography;

export const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 24px;
  min-height: 70vh;

  @media (max-width: 768px) {
    margin: 24px auto;
    padding: 0 16px;
  }
`;

export const SidebarTabs = styled(Tabs)`
  .ant-tabs-nav {
    width: 250px;
  }
  .ant-tabs-tab {
    font-size: 1.3rem;
    padding: 12px 0;
    color: #888;
    justify-content: flex-start;
  }
  .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #000000 !important;
    font-weight: 600;
  }
  .ant-tabs-ink-bar {
    display: none;
  }

  @media (max-width: 768px) {
    .ant-tabs-nav {
      width: 100%;
    }
    .ant-tabs-tab {
      justify-content: center;
      padding: 12px 16px;
    }
  }
`;

export const ContentWrapper = styled(Flex)`
  flex-direction: column;
  gap: 40px;
  max-width: 650px;
  padding-left: 24px;

  @media (max-width: 768px) {
    padding-left: 0;
    max-width: 100%;
    gap: 24px;
  }
`;

export const SectionContainer = styled(Flex)`
  flex-direction: column;
`;

export const SectionHeader = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const SectionTitle = styled(Title)`
  &.ant-typography {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

export const InfoCard = styled(Card)`
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  box-shadow: none;

  .ant-card-body {
    padding: 16px 24px;
  }

  @media (max-width: 768px) {
    .ant-card-body {
      padding: 16px;
    }
  }
`;

export const InfoRow = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const IconRow = styled(Flex)`
  align-items: center;
  gap: 12px;
`;

export const LabelText = styled(Text)`
  color: #666;
`;

export const ValueText = styled(Text)`
  font-weight: 500;
  color: #333;
`;

export const OutlinedButton = styled(Button)`
  border-radius: 20px;
  font-weight: 500;
  padding: 0 16px;
`;

export const SignOutWrapper = styled(Flex)`
  align-items: center;
  gap: 24px;
  margin-top: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const SignOutLink = styled(Text)`
  color: #d4a373;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
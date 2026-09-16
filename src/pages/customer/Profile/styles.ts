import styled from "styled-components";
import { Tabs, Typography, Flex, Card } from "antd";

const { Text } = Typography;

export const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 36px auto;
  padding: 0 20px;
  min-height: 75vh;

  @media (max-width: 768px) {
    margin: 20px auto;
    padding: 0 16px;
  }
`;

export const ProfileHeroCard = styled(Card)`
  margin-bottom: 28px;
  border-radius: 16px;
  border: 1px solid #e0e7ff;
  background: linear-gradient(135deg, #00009c 0%, #1e1b4b 100%);
  color: #ffffff;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 156, 0.25);
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: -50px;
    right: -50px;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .ant-card-body {
    padding: 28px 32px;

    @media (max-width: 768px) {
      padding: 20px 18px;
    }
  }
`;

export const HeroFlex = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const HeroIdentity = styled(Flex)`
  align-items: center;
  gap: 20px;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
`;

export const HeroAvatar = styled.div`
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background: #ffffff;
  color: #00009c;
  font-size: 28px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.85);
  flex-shrink: 0;
`;

export const HeroStats = styled(Flex)`
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

export const StatPill = styled.div`
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 90px;

  .stat-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: rgba(255, 255, 255, 0.75);
    font-weight: 600;
  }

  .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #ffffff;
    line-height: 1.2;
    margin-top: 2px;
  }
`;

export const SidebarTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 24px;

    &::before {
      border-bottom: 1px solid #e2e8f0;
    }
  }

  .ant-tabs-tab {
    font-size: 1.05rem;
    padding: 10px 20px;
    margin: 0 8px 0 0;
    color: #64748b;
    border-radius: 10px;
    transition: all 0.2s ease;

    &:hover {
      color: #00009c;
      background: #f1f5f9;
    }
  }

  .ant-tabs-tab-active {
    background: #eef2ff !important;

    .ant-tabs-tab-btn {
      color: #00009c !important;
      font-weight: 700;
    }
  }

  .ant-tabs-ink-bar {
    background: #00009c;
    height: 3px;
    border-radius: 3px;
  }
`;

export const ContentWrapper = styled(Flex)`
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const SectionContainer = styled(Flex)`
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const SignOutWrapper = styled(Flex)`
  align-items: center;
  gap: 20px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px dashed #e2e8f0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }
`;

export const SignOutLink = styled(Text)`
  color: #dc2626;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
`;

export const HeaderRow = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;
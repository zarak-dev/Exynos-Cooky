import styled from "styled-components";
import { Card, Button, Tabs, Typography, Flex, Image } from "antd";

const { Text, Paragraph } = Typography;
const { Meta } = Card;

export const HomeContainer = styled.div`
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const CoverImage = styled(Image)`
  height: 280px !important;
  object-fit: cover !important;
  padding: 12px !important;
  background: #fafafa !important;
`;

export const CardHeader = styled(Flex)`
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
`;

export const StyledButton = styled(Button)`
  width: 100%;
  height: 45px;
`;

export const ExploreSection = styled.div`
  max-width: 500px;
  margin: 0 auto 40px;
  text-align: center;
`;

export const MenuTabs = styled(Tabs)`
  .ant-tabs-nav-wrap {
    justify-content: center;
  }

  .ant-tabs-tab {
    font-weight: 700;
    text-transform: uppercase;
    font-size: 1.1rem;
    padding: 12px 24px !important;

    &:hover {
      color: #00009c !important;
    }
  }

  .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #00009c !important;
  }

  .ant-tabs-ink-bar {
    background: #00009c !important;
    height: 3px !important;
  }

`;

export const NoResults = styled(Paragraph)`
  &.ant-typography {
    text-align: center;
    padding: 60px 20px;
    font-size: 1.1rem;
    color: #666;
  }
`;

export const RatingWrapper = styled(Flex)`
  margin: -4px 0 12px;
`;

export const ReviewCountText = styled(Text)`
  margin-left: 8px;
  font-size: 0.8rem;
  color: #666;
`;

export const StyledMeta = styled(Meta)`
  margin-bottom: 16px;
  min-height: 60px;
`;
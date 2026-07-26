import styled from "styled-components";
import { Card, Button, Tabs, Input, Typography, Flex, Tag, Image } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export const HomeContainer = styled.div`
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
`;

export const PageTitle = styled(Title)`
  &.ant-typography {
    text-align: center;
    font-size: 2.2rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: "Poppins", sans-serif;
    color: #00009c;
    margin-bottom: 50px;
  }
`;

export const StyledCard = styled(Card)<{ $isAvailable: boolean }>`
  border-radius: 0px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
  box-shadow: none;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.$isAvailable ? 1 : 0.5)};

  &:hover {
    border-color: #00009c;
  }
`;

export const CoverImage = styled(Image)`
  height: 280px !important;
  object-fit: cover !important;
  padding: 12px !important;
  background-color: #fafafa !important;
`;

export const CardHeader = styled(Flex)`
  width: 100%; /* Ensures the flex container doesn't collapse */
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
`;

export const CookieTitle = styled(Title)`
  &.ant-typography {
    flex: 1;
    word-break: break-word;
    line-height: 1.3;
    font-size: 1.15rem;
    font-weight: 700;
    color: #00009c;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

export const PriceTag = styled(Text)`
  &.ant-typography {
    font-size: 1.1rem;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
    font-weight: 700;
    color: #00009c;
  }
`;

export const StyledButton = styled(Button)`
  width: 100%;
  border-radius: 0px;
  background-color: #00009c;
  border-color: #00009c;
  color: #ffffff;
  font-weight: 700;
  text-transform: uppercase;
  height: 45px;
  letter-spacing: 1px;

  &:hover {
    background-color: #000066 !important;
    border-color: #000066 !important;
    color: #ffffff !important;
  }
`;

export const OutOfStockBadge = styled(Tag)`
  background-color: #e0e0e0;
  color: #666;
  border: none;
  padding: 4px 8px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  flex-shrink: 0;
`;

export const ExploreSection = styled.div`
  max-width: 500px;
  margin: 0 auto 40px auto;
  text-align: center;
`;

export const ExploreTitle = styled(Title)`
  &.ant-typography {
    color: #00009c;
    font-weight: 800;
    font-size: 2rem;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
`;

export const SearchWrapper = styled(Flex)`
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  border: 2px solid #00009c;
  height: 48px;
  background-color: #ffffff;
`;

export const SearchBarInput = styled(Input)`
  border: none !important;
  border-radius: 0px !important;
  height: 100% !important;
  font-family: "Poppins", sans-serif;
  font-size: 0.95rem;
  padding-left: 16px;

  &:focus,
  &:hover {
    box-shadow: none !important;
    border: none !important;
  }
`;

export const SearchBarButton = styled(Button)`
  border: none !important;
  border-radius: 0px !important;
  height: 100% !important;
  background-color: #00009c !important;
  color: #ffffff !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px !important;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #000066 !important;
  }
`;

export const StyledSearchIcon = styled(SearchOutlined)`
  font-size: 1.3rem;
  color: #ffffff;
`;

export const MenuTabs = styled(Tabs)`
  .ant-tabs-nav-wrap {
    justify-content: center;
  }

  .ant-tabs-tab {
    font-family: "Poppins", sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 1.1rem;
    letter-spacing: 0.5px;
    color: #555555;
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

export const CookieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
  margin-top: 20px;
`;

export const NoResults = styled(Paragraph)`
  &.ant-typography {
    text-align: center;
    padding: 60px 20px;
    font-size: 1.1rem;
    color: #666;
    font-weight: 500;
  }
`;

export const RatingWrapper = styled(Flex)`
  margin-bottom: 12px;
  margin-top: -4px;
`;

export const ReviewCountText = styled(Text)`
  margin-left: 8px;
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
`;

export const StyledCardMeta = styled(Card.Meta)`
  margin-bottom: 16px;
  min-height: 60px;
`;

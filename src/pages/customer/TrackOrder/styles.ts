import styled from "styled-components";
import { Card, Typography, Flex } from "antd";

const { Title, Text, Paragraph } = Typography;

export const TrackContainer = styled.div`
  padding: 40px 24px;
  max-width: 800px;
  margin: 0 auto;
  min-height: 80vh;

  @media (max-width: 576px) {
    padding: 24px 16px;
  }
`;

export const PageTitle = styled(Title)`
  &.ant-typography {
    color: #00009c;
    font-weight: 800;
    margin-bottom: 8px;
    text-align: center;

    @media (max-width: 576px) {
      font-size: 1.5rem;
    }
  }
`;

export const PageSubtitle = styled(Paragraph)`
  &.ant-typography {
    text-align: center;
    color: #666;
    margin-bottom: 32px;

    @media (max-width: 576px) {
      font-size: 0.9rem;
      margin-bottom: 20px;
    }
  }
`;

export const SearchCard = styled(Card)`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;

  .ant-card-body {
    padding: 20px;

    @media (max-width: 576px) {
      padding: 16px;
    }
  }
`;

export const SearchWrapper = styled(Flex)`
  gap: 12px;
  width: 100%;
  align-items: center;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: stretch;

    .ant-input,
    .ant-input-affix-wrapper {
      width: 100% !important;
    }

    .ant-btn {
      width: 100%;
      height: 42px;
    }
  }
`;

export const ResultCard = styled(Card)`
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  .ant-card-body {
    padding: 24px;

    @media (max-width: 576px) {
      padding: 16px;
    }
  }
`;

export const ResultHeader = styled(Flex)`
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

export const OrderTitle = styled(Title)`
  &.ant-typography {
    margin: 0;
  }
`;

export const OrderIdText = styled(Text)`
  color: #00009c;
`;

export const OrderDateText = styled(Paragraph)`
  &.ant-typography {
    color: #888;
    margin: 4px 0 0 0;
  }
`;

export const BadgeText = styled(Text)`
  color: #00009c;
`;

export const DetailsCard = styled(Card)`
  margin-top: 24px;

  .ant-descriptions-view {
    table-layout: fixed;
    width: 100%;
  }

  .ant-descriptions-item-content {
    word-break: break-word;
  }
`;

export const DetailRow = styled(Paragraph)<{ $isLast?: boolean }>`
  &.ant-typography {
    margin-bottom: ${(props) => (props.$isLast ? "0" : "1em")};
  }
`;

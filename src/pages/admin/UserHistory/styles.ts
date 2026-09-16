import styled from "styled-components";
import { Card, Flex } from "antd";

export const HistoryCardWrapper = styled(Card)`
  max-width: 1280px;
  margin: 0 auto;
  box-shadow: 0 1px 4px rgba(0, 0, 50, 0.05);
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  overflow: hidden;

  .ant-card-body {
    padding: 20px;
  }

  .ant-table-wrapper,
  .ant-table-container,
  .ant-table-content {
    overflow-x: hidden !important;
  }

  .ant-table-thead > tr > th {
    background: #f8fafc;
    color: #475569;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 12px 10px;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
  }

  .ant-table-tbody > tr > td {
    padding: 12px 10px;
    font-size: 13px;
    border-bottom: 1px solid #f1f5f9;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f8fafc !important;
  }

  @media (max-width: 768px) {
    .ant-card-body {
      padding: 14px;
    }
  }
`;

export const ResponsiveToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
  margin-bottom: 16px;

  .search-input {
    width: 280px;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  .title-text {
    font-size: 16px;
    font-weight: 700;
    color: #00009c;
  }
`;

export const MobileCustomerCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 50, 0.04);
  transition: all 0.2s ease;

  &:hover {
    border-color: #c7d2fe;
    box-shadow: 0 4px 12px rgba(0, 0, 156, 0.07);
  }
`;

export const SearchWrapper = styled(Flex)`
  justify-content: flex-end;
  margin-bottom: 8px;

  .ant-input-affix-wrapper {
    width: 260px;
  }
`;


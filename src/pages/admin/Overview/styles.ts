import styled from "styled-components";
import { Card, Flex, Typography } from "antd";

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const DashboardHeader = styled.h1`
  color: #00009c;
  margin: 0;
  font-weight: 800;
  font-size: 1.8rem;
`;

export const StyledMetricCard = styled(Card)`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .ant-statistic-title {
    font-weight: 500;
  }
`;

export const StyledChartCard = styled(Card)`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 8px;

  .ant-card-head-title {
    color: #00009c;
    font-weight: 700;
  }
`;

export const ChartWrapper = styled.div<{ height?: string }>`
  height: ${(props) => props.height || "320px"};
  width: 100%;
`;

export const StockListWrapper = styled.div`
  height: 320px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d9d9d9;
    border-radius: 4px;
  }
`;

export const StockItem = styled.div<{ $isLast: boolean }>`
  padding: 12px 0;
  border-bottom: ${(props) => (props.$isLast ? "none" : "1px solid #f0f0f0")};
`;

export const StockItemHeader = styled(Flex)`
  margin-bottom: 6px;
`;

export const StockTagsWrapper = styled(Flex)`
  align-items: center;
`;

export const StockCountText = styled(Typography.Text)`
  margin-right: 12px;
  font-size: 0.85rem;
`;

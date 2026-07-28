import React from "react";
import { chartConfig, pieConfig, inventoryData } from "./constants";
import { Row, Col, Progress, Tag, Typography, Card } from "antd";
import { Column, Pie } from "@ant-design/charts";
import {
  ArrowUpOutlined,
  ShoppingOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  StyledMetricCard,
  StyledChartCard,
  ChartWrapper,
  StockListWrapper,
  StockItem,
  StockItemHeader,
  StockTagsWrapper,
  StockCountText,
} from "./styles";
import { StateCard } from "../../../components/StateCard";
import StyledPageHeader from "../../../components/PageHeader";
import { Wrapper } from "../../../components/Wrapper";

const { Text } = Typography;

export const AdminOverview: React.FC = () => {
  const stats = [
    {
      title: "Net Revenue",
      value: 385270,
      prefix: <DollarOutlined />,
      suffix: "Rs.",
      Component: StateCard,
      wrapper: Card,
    },
    {
      title: "Boxes Baked / Sold",
      value: 284,
      prefix: <ShoppingOutlined />,
      Component: StateCard,
      wrapper: StyledMetricCard,
    },
    {
      title: "Month-over-Month Growth",
      value: 28.4,
      precision: 2,
      prefix: <ArrowUpOutlined />,
      suffix: "%",
      Component: StateCard,
      wrapper: StyledMetricCard,
    },
    {
      title: "Active System Users",
      value: 18,
      prefix: <UserOutlined />,
      Component: StateCard,
      wrapper: StyledMetricCard,
    },
  ];

  return (
    <>
      <StyledPageHeader
        title="OPERATIONAL METRICS"
        breadcrumbs={[{ title: "Home" }]}
      />
      <Row gutter={[16, 16]}>
        {stats.map((item, index) => {
          const Wrapper = item.wrapper;
          const StatisticComponent = item.Component;

          return (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Wrapper variant="borderless">
                <StatisticComponent
                  title={item.title}
                  value={item.value}
                  prefix={item.prefix}
                  suffix={item.suffix}
                  precision={item.precision}
                />
              </Wrapper>
            </Col>
          );
        })}
      </Row>

      <StyledChartCard
        title="Gross Financial Performance Trajectory"
        variant="borderless"
      >
        <ChartWrapper height="350px">
          <Column {...chartConfig} />
        </ChartWrapper>
      </StyledChartCard>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <StyledChartCard
            title="Sales Distribution Share"
            variant="borderless"
          >
            <ChartWrapper>
              <Pie {...pieConfig} />
            </ChartWrapper>
          </StyledChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <StyledChartCard
            title="Kitchen Stock Status Overview"
            variant="borderless"
          >
            <StockListWrapper>
              {inventoryData.map((item, index) => {
                const stockPercentage = Math.round(
                  (item.stock / item.maxCapacity) * 100,
                );
                const isLowStock = item.stock < 30;

                return (
                  <StockItem
                    key={item.name}
                    $isLast={index === inventoryData.length - 1}
                  >
                    <StockItemHeader justify="space-between" align="center">
                      <Text strong>{item.name}</Text>
                      <StockTagsWrapper>
                        <StockCountText type="secondary">
                          {item.stock} / {item.maxCapacity} units
                        </StockCountText>
                        <Tag color={isLowStock ? "red" : "green"}>
                          {isLowStock ? "LOW STOCK" : "IN STOCK"}
                        </Tag>
                      </StockTagsWrapper>
                    </StockItemHeader>
                    <Progress
                      percent={stockPercentage}
                      strokeColor={isLowStock ? "#f5222d" : "#00009c"}
                      status={isLowStock ? "exception" : "normal"}
                    />
                  </StockItem>
                );
              })}
            </StockListWrapper>
          </StyledChartCard>
        </Col>
      </Row>
    </>
  );
};

export default AdminOverview;

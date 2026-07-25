import React from 'react';
import { chartConfig, pieConfig, inventoryData } from './constants';
import { Row, Col, Progress, Tag, Typography } from 'antd';
import { Column, Pie } from '@ant-design/charts';
import { ArrowUpOutlined, ShoppingOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import {
  DashboardContainer,
  DashboardHeader,
  StyledMetricCard,
  StyledChartCard,
  ChartWrapper,
  StockListWrapper,
  StockItem,
  PrimaryStatistic,
  SuccessStatistic,
  StockItemHeader,
  StockTagsWrapper,
  StockCountText
} from './styles';

const { Text } = Typography;

export const AdminOverview: React.FC = () => {
  return (
    <DashboardContainer>
      <DashboardHeader>OPERATIONAL METRICS</DashboardHeader>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StyledMetricCard variant="borderless">
            <PrimaryStatistic 
              title="Net Revenue" 
              value={385270} 
              prefix={<DollarOutlined />} 
              suffix="Rs." 
            />
          </StyledMetricCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledMetricCard variant="borderless">
            <SuccessStatistic 
              title="Boxes Baked / Sold" 
              value={284} 
              prefix={<ShoppingOutlined />} 
            />
          </StyledMetricCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledMetricCard variant="borderless">
            <SuccessStatistic 
              title="Month-over-Month Growth" 
              value={28.40} 
              precision={2} 
              prefix={<ArrowUpOutlined />} 
              suffix="%" 
            />
          </StyledMetricCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledMetricCard variant="borderless">
            <PrimaryStatistic 
              title="Active System Users" 
              value={18} 
              prefix={<UserOutlined />} 
            />
          </StyledMetricCard>
        </Col>
      </Row>

      <StyledChartCard title="Gross Financial Performance Trajectory" variant="borderless">
        <ChartWrapper height="350px">
          <Column {...chartConfig} />
        </ChartWrapper>
      </StyledChartCard>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <StyledChartCard title="Sales Distribution Share" variant="borderless">
            <ChartWrapper>
              <Pie {...pieConfig} />
            </ChartWrapper>
          </StyledChartCard>
        </Col>

        <Col xs={24} lg={12}>
          <StyledChartCard title="Kitchen Stock Status Overview" variant="borderless">
            <StockListWrapper>
              {inventoryData.map((item, index) => {
                const stockPercentage = Math.round((item.stock / item.maxCapacity) * 100);
                const isLowStock = item.stock < 30;
                
                return (
                  <StockItem key={item.name} $isLast={index === inventoryData.length - 1}>
                    <StockItemHeader justify="space-between" align="center">
                      <Text strong>{item.name}</Text>
                      <StockTagsWrapper>
                        <StockCountText type="secondary">
                          {item.stock} / {item.maxCapacity} units
                        </StockCountText>
                        <Tag color={isLowStock ? 'red' : 'green'}>
                          {isLowStock ? 'LOW STOCK' : 'IN STOCK'}
                        </Tag>
                      </StockTagsWrapper>
                    </StockItemHeader>
                    <Progress 
                      percent={stockPercentage} 
                      strokeColor={isLowStock ? '#f5222d' : '#00009c'} 
                      status={isLowStock ? 'exception' : 'normal'}
                    />
                  </StockItem>
                );
              })}
            </StockListWrapper>
          </StyledChartCard>
        </Col>
      </Row>
    </DashboardContainer>
  );
};

export default AdminOverview;
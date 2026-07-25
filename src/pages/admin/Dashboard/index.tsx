import React from 'react';
import { Row, Col, Statistic, Progress, Tag, Typography, Flex } from 'antd';
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
} from './styles';

const { Text } = Typography;

// 🌟 DATA MOVED OUTSIDE COMPONENT TO PREVENT RE-RENDERS
const chartData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 61000 },
  { month: 'Apr', revenue: 58000 },
  { month: 'May', revenue: 74000 },
  { month: 'Jun', revenue: 95000 },
];

const chartConfig = {
  data: chartData,
  xField: 'month',
  yField: 'revenue',
  colorField: '#1890ff',
  style: { radius: [4, 4, 0, 0] },
  label: {
    text: (d: any) => `${d.revenue}`,
    position: 'top',
    style: { fill: '#8c8c8c', opacity: 0.6 },
  },
};

const pieData = [
  { type: 'Chilled Sugar', value: 40 },
  { type: 'Triple Chocolate', value: 25 },
  { type: 'Classic Chocolate Chip', value: 15 },
  { type: 'Red Velvet Classic', value: 12 },
  { type: 'Lotus Biscoff', value: 8 },
];

const pieConfig = {
  data: pieData,
  angleField: 'value',
  colorField: 'type',
  innerRadius: 0.6,
  label: { text: 'value', style: { fontWeight: 'bold' } },
  legend: { color: { position: 'bottom', layout: { justifyContent: 'center' } } },
};

const inventoryData = [
  { name: 'Chilled Sugar', stock: 120, maxCapacity: 150 },
  { name: 'Triple Chocolate', stock: 18, maxCapacity: 150 },
  { name: 'Classic Chocolate Chip', stock: 85, maxCapacity: 150 },
  { name: 'Red Velvet Classic', stock: 140, maxCapacity: 150 },
  { name: 'Lotus Biscoff', stock: 55, maxCapacity: 150 },
];

export const AdminOverview: React.FC = () => {
  return (
    <DashboardContainer>
      <DashboardHeader>OPERATIONAL METRICS</DashboardHeader>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StyledMetricCard variant="borderless">
            <Statistic 
              title="Net Revenue" 
              value={385270} 
              styles={{ content: { color: '#00009c', fontWeight: 700 } }} 
              prefix={<DollarOutlined />} 
              suffix="Rs." 
            />
          </StyledMetricCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledMetricCard variant="borderless">
            <Statistic 
              title="Boxes Baked / Sold" 
              value={284} 
              styles={{ content: { color: '#3f8600', fontWeight: 700 } }} 
              prefix={<ShoppingOutlined />} 
            />
          </StyledMetricCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledMetricCard variant="borderless">
            <Statistic 
              title="Month-over-Month Growth" 
              value={28.40} 
              precision={2} 
              styles={{ content: { color: '#3f8600', fontWeight: 700 } }} 
              prefix={<ArrowUpOutlined />} 
              suffix="%" 
            />
          </StyledMetricCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StyledMetricCard variant="borderless">
            <Statistic 
              title="Active System Users" 
              value={18} 
              styles={{ content: { color: '#00009c', fontWeight: 700 } }} 
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
                    <Flex justify="space-between" align="center" style={{ marginBottom: 6 }}>
                      <Text strong>{item.name}</Text>
                      <div>
                        <Text type="secondary" style={{ marginRight: 12, fontSize: '0.85rem' }}>
                          {item.stock} / {item.maxCapacity} units
                        </Text>
                        <Tag color={isLowStock ? 'red' : 'green'}>
                          {isLowStock ? 'LOW STOCK' : 'IN STOCK'}
                        </Tag>
                      </div>
                    </Flex>
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
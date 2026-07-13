import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { Column } from '@ant-design/charts'; 
import { ArrowUpOutlined, ShoppingOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';

export const AdminOverview: React.FC = () => {
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
    color: '#6093ff',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'top',
      style: {
        fill: '#8c8c8c',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        style: { fill: '#8c8c8c' },
      },
    },
    yAxis: {
      label: {
        style: { fill: '#8c8c8c' },
      },
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ color: '#00009c', margin: 0, fontWeight: 800, fontSize: '1.8rem' }}>
        OPERATIONAL METRICS
      </h1>

      {/* STATISTICAL CARDS ROW */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic title="Net Revenue" value={385270} valueStyle={{ color: '#00009c', fontWeight: 700 }} prefix={<DollarOutlined />} suffix="Rs." />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic title="Boxes Baked / Sold" value={284} valueStyle={{ color: '#3f8600', fontWeight: 700 }} prefix={<ShoppingOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic title="Month-over-Month Growth" value={28.40} precision={2} valueStyle={{ color: '#3f8600', fontWeight: 700 }} prefix={<ArrowUpOutlined />} suffix="%" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic title="Active System Users" value={18} valueStyle={{ color: '#00009c', fontWeight: 700 }} prefix={<UserOutlined />} />
          </Card>
        </Col>
      </Row>

      {/* COLUMN CHART CONTAINER */}
      <Card 
        title={<span style={{ color: '#00009c', fontWeight: 700 }}>Gross Financial Performance Trajectory</span>}
        bordered={false}
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginTop: '8px' }}
      >
        <div style={{ height: '350px' }}>
          <Column {...chartConfig} autoFit />
        </div>
      </Card>
    </div>
  );
};

export default AdminOverview;
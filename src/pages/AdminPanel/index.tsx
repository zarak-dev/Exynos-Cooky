import React from 'react';
import { Row, Col, Card, Statistic, Progress, List, Tag, Typography } from 'antd';
import { Column, Pie } from '@ant-design/charts';
import { ArrowUpOutlined, ShoppingOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';

const { Text } = Typography;

export const AdminOverview: React.FC = () => {
  // Column Chart Data
  const chartData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 61000 },
    { month: 'Apr', revenue: 58000 },
    { month: 'May', revenue: 74000 },
    { month: 'Jun', revenue: 95000 },
  ];

  // 🌟 Clean Column Chart Config (Compatible with Ant Design Charts v2+)
  const chartConfig = {
    data: chartData,
    xField: 'month',
    yField: 'revenue',
    colorField: '#1890ff',
    style: {
      radius: [4, 4, 0, 0],
    },
    label: {
      text: (d: any) => `${d.revenue}`,
      position: 'top',
      style: {
        fill: '#8c8c8c',
        opacity: 0.6,
      },
    },
  };

  // Pie/Donut Chart Data
  const pieData = [
    { type: 'Chilled Sugar', value: 40 },
    { type: 'Triple Chocolate', value: 25 },
    { type: 'Classic Chocolate Chip', value: 15 },
    { type: 'Red Velvet Classic', value: 12 },
    { type: 'Lotus Biscoff', value: 8 },
  ];

  // 🌟 Fixed Pie Config (Removed deprecated shape.inner / type:'inner')
  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    innerRadius: 0.6, // Donut style
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        position: 'bottom',
        layout: { justifyContent: 'center' },
      },
    },
  };

  const inventoryData = [
    { name: 'Chilled Sugar', stock: 120, maxCapacity: 150 },
    { name: 'Triple Chocolate', stock: 18, maxCapacity: 150 },
    { name: 'Classic Chocolate Chip', stock: 85, maxCapacity: 150 },
    { name: 'Red Velvet Classic', stock: 140, maxCapacity: 150 },
    { name: 'Lotus Biscoff', stock: 55, maxCapacity: 150 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ color: '#00009c', margin: 0, fontWeight: 800, fontSize: '1.8rem' }}>
        OPERATIONAL METRICS
      </h1>

      {/* STATISTICAL CARDS ROW */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic 
              title="Net Revenue" 
              value={385270} 
              styles={{ content: { color: '#00009c', fontWeight: 700 } }} 
              prefix={<DollarOutlined />} 
              suffix="Rs." 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic 
              title="Boxes Baked / Sold" 
              value={284} 
              styles={{ content: { color: '#3f8600', fontWeight: 700 } }} 
              prefix={<ShoppingOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic 
              title="Month-over-Month Growth" 
              value={28.40} 
              precision={2} 
              styles={{ content: { color: '#3f8600', fontWeight: 700 } }} 
              prefix={<ArrowUpOutlined />} 
              suffix="%" 
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Statistic 
              title="Active System Users" 
              value={18} 
              styles={{ content: { color: '#00009c', fontWeight: 700 } }} 
              prefix={<UserOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      {/* COLUMN CHART CONTAINER */}
      <Card 
        title={<span style={{ color: '#00009c', fontWeight: 700 }}>Gross Financial Performance Trajectory</span>}
        variant="borderless"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginTop: '8px' }}
      >
        <div style={{ height: '350px' }}>
          <Column {...chartConfig} />
        </div>
      </Card>

      {/* SIDE-BY-SIDE OVERVIEW ROW */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ color: '#00009c', fontWeight: 700 }}>Sales Distribution Share</span>} 
            variant="borderless" 
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <div style={{ height: '320px' }}>
              <Pie {...pieConfig} />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ color: '#00009c', fontWeight: 700 }}>Kitchen Stock Status Overview</span>} 
            variant="borderless" 
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <div style={{ height: '320px', overflowY: 'auto', paddingRight: '4px' }}>
              <List
                itemLayout="horizontal"
                dataSource={inventoryData}
                renderItem={(item) => {
                  const stockPercentage = Math.round((item.stock / item.maxCapacity) * 100);
                  const isLowStock = item.stock < 30;

                  return (
                    <List.Item style={{ padding: '12px 0' }}>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <Text strong>{item.name}</Text>
                          <div>
                            <span style={{ marginRight: 12, color: '#8c8c8c', fontSize: '0.85rem' }}>
                              {item.stock} / {item.maxCapacity} units
                            </span>
                            {isLowStock ? (
                              <Tag color="red">LOW STOCK</Tag>
                            ) : (
                              <Tag color="green">IN STOCK</Tag>
                            )}
                          </div>
                        </div>
                        <Progress 
                          percent={stockPercentage} 
                          strokeColor={isLowStock ? '#f5222d' : '#00009c'} 
                          status={isLowStock ? "exception" : "normal"}
                        />
                      </div>
                    </List.Item>
                  );
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminOverview;
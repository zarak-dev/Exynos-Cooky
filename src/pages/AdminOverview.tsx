import React from 'react';
import { Row, Col, Card, Statistic, Progress, List, Tag, Typography } from 'antd';
import { Column, Pie } from '@ant-design/charts'; // 🌟 Added Pie component here
import { ArrowUpOutlined, ShoppingOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux'; // 🌟 Fixed typo from Type UseSelector to standard hook
import { type RootState } from '../store';

const { Text } = Typography;

export const AdminOverview: React.FC = () => {
  // const inventory = useSelector((state: RootState) => state.inventory.items);
  
  // Existing Bar Chart Data
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
    color: '#1890ff',
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

  // 🌟 NEW: Pie Chart Data (Cookie Distribution Share)
  const pieData = [
    { type: 'Chilled Sugar', value: 40 },
    { type: 'Triple Chocolate', value: 25 },
    { type: 'Classic Chocolate Chip', value: 15 },
    { type: 'Red Velvet Classic', value: 12 },
    { type: 'Lotus Biscoff', value: 8 },
  ];

  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6, // Gives it a clean donut style look
    color: ['#00009c', '#1890ff', '#722ed1', '#52c41a', '#faad14'],
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}%',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };

  // 🌟 NEW: Inventory Mock Data
  const inventoryData = [
    { name: 'Chilled Sugar', stock: 120, maxCapacity: 150 },
    { name: 'Triple Chocolate', stock: 18, maxCapacity: 150 }, // Low Stock example
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

      {/* 🌟 NEW SIDE-BY-SIDE OVERVIEW ROW */}
      <Row gutter={[24, 24]}>
        {/* PIE CHART COLUMN */}
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ color: '#00009c', fontWeight: 700 }}>Sales Distribution Share</span>} 
            bordered={false} 
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            <div style={{ height: '320px' }}>
              <Pie {...pieConfig} autoFit />
            </div>
          </Card>
        </Col>

        {/* INVENTORY STATUS MONITOR COLUMN */}
        <Col xs={24} lg={12}>
          <Card 
            title={<span style={{ color: '#00009c', fontWeight: 700 }}>Kitchen Stock Status Overview</span>} 
            bordered={false} 
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          />
            <div style={{ height: '320px', overflowY: 'auto', paddingRight: '4px' }}>
              <List
                itemLayout="horizontal"
                dataSource={inventoryData}
                renderItem={(item) => {
                  const stockPercentage = Math.round((item.stock / item.maxCapacity) * 100);
                  const isLowStock = item.stock < 30; // Triggers alert warning under 30 units

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
          </Col>
        </Row>
    </div>
  );
};

export default AdminOverview;
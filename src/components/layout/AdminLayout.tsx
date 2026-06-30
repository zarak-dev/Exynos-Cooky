import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  DatabaseOutlined, 
  ShoppingOutlined, 
  HomeOutlined 
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';

const { Header, Sider, Content } = Layout;

const AdminLogo = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000066;
  color: #ffffff;
  font-weight: 900;
  font-size: 1.1rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-bottom: 1px solid #00004d;
`;

const StyledHeader = styled(Header)`
  background: #ffffff !important;
  padding: 0 24px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 700;
  color: #00009c;
`;

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'OVERVIEW',
    },
    {
      key: '/admin/inventory',
      icon: <DatabaseOutlined />,
      label: 'INVENTORY',
    },
    {
      key: '/admin/orders',
      icon: <ShoppingOutlined />,
      label: 'ORDERS QUEUE',
    },
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'EXIT',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
      navigate(key);
  };

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        style={{ 
          background: '#00009c',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100
        }}
      >
        <AdminLogo>
          {collapsed ? 'EXNS' : 'Exynos Admin'}
        </AdminLogo>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/admin']}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ background: '#00009c', marginTop: '16px' }}
        />
      </Sider>
      
      
      <Layout style={{ 
        marginLeft: collapsed ? '80px' : '200px', // Dynamically shifts content when sidebar collapses
        transition: 'all 0.2s',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <StyledHeader>
          <div style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Operational Command Center
          </div>
          <div style={{ fontSize: '0.85rem', color: '#666' }}>
            Logged in as: <strong>Admin</strong>
          </div>
        </StyledHeader>

        {/* This handles the isolated vertical scrolling */}
        <Content style={{ 
          margin: '24px', 
          padding: '24px',
          background: '#f5f5f5',
          overflowY: 'auto', // 🌟 Only the inventory and graphs scroll now!
          flex: 1
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )};
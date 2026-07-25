import React, { useState } from 'react';
import { Menu, Typography } from 'antd';
import { 
  DashboardOutlined, 
  DatabaseOutlined, 
  ShoppingOutlined, 
  TeamOutlined,      
  LogoutOutlined     
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

import { 
  AdminLayoutWrapper, 
  StyledSider, 
  AdminLogo, 
  MainContentWrapper, 
  StyledHeader, 
  StyledContent,
  HeaderTitle,     // New
  HeaderSubtitle   // New
} from './styles';

const { Text } = Typography;

const menuItems = [
  { key: '/admin', icon: <DashboardOutlined />, label: 'OVERVIEW' },
  { key: '/admin/inventory', icon: <DatabaseOutlined />, label: 'INVENTORY' },
  { key: '/admin/orders', icon: <ShoppingOutlined />, label: 'ORDERS QUEUE' },
  { key: '/admin/history', icon: <TeamOutlined />, label: 'CUSTOMER HISTORY' },
  { key: '/', icon: <LogoutOutlined />, label: 'EXIT' },
];

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };
  
  return (
    <AdminLayoutWrapper>
      <StyledSider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
      >
        {/* 🌟 Uses Ant Design Flex underneath */}
        <AdminLogo justify="center" align="center">
          {collapsed ? 'EXNS' : 'Exynos Admin'}
        </AdminLogo>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </StyledSider>
      
      <MainContentWrapper $collapsed={collapsed}>
        <StyledHeader>
          
          {/* 🌟 Zero HTML tags. Uses Ant Design Typography.Text underneath */}
          <HeaderTitle>
            Operational Command Center
          </HeaderTitle>
          
          <HeaderSubtitle>
            Logged in as: <Text strong style={{ color: '#00009c' }}>Admin</Text>
          </HeaderSubtitle>

        </StyledHeader>

        <StyledContent>
          <Outlet /> 
        </StyledContent>
      </MainContentWrapper>
    </AdminLayoutWrapper>
  );
};

export default AdminLayout;
import React, { useState } from "react";
import { Menu } from "antd";
import {
  DashboardOutlined,
  DatabaseOutlined,
  ShoppingOutlined,
  TeamOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

import {
  AdminLayoutWrapper,
  StyledSider,
  AdminLogo,
  MainContentWrapper,
  StyledHeader,
  StyledContent,
  HeaderTitle,
  HeaderSubtitle,
  HeaderLeft,
  MenuToggleButton,
  AdminNameText,
} from "./styles";

const menuItems = [
  { key: "/admin", icon: <DashboardOutlined />, label: "OVERVIEW" },
  { key: "/admin/inventory", icon: <DatabaseOutlined />, label: "INVENTORY" },
  { key: "/admin/orders", icon: <ShoppingOutlined />, label: "ORDERS QUEUE" },
  { key: "/admin/history", icon: <TeamOutlined />, label: "CUSTOMER HISTORY" },
  { key: "/", icon: <LogoutOutlined />, label: "EXIT" },
];

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    if (window.innerWidth <= 768) {
      setCollapsed(true);
    }
  };

  return (
    <AdminLayoutWrapper>
      <StyledSider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="md"
        collapsedWidth={0}
        onCollapse={(value) => setCollapsed(value)}
      >
        <AdminLogo justify="center" align="center">
          {collapsed ? "EXNS" : "Exynos Admin"}
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
          <HeaderLeft align="center">
            <MenuToggleButton
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <HeaderTitle>Operational Command Center</HeaderTitle>
          </HeaderLeft>

          <HeaderSubtitle>
            Logged in as: <AdminNameText strong>Admin</AdminNameText>
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

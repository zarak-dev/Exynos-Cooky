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
  MenuOutlined,
} from "@ant-design/icons";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  AdminLayoutWrapper,
  StyledSider,
  AdminLogo,
  SiderFooter,
  CollapseButton,
  MainContentWrapper,
  StyledHeader,
  StyledContent,
  HeaderTitle,
  HeaderSubtitle,
  HeaderLeft,
  AdminNameText,
  MobileAdminMenuBtn,
  AdminMobileDrawer,
} from "./styles";

const menuItems = [
  { key: "/admin", icon: <DashboardOutlined />, label: "Overview" },
  { key: "/admin/inventory", icon: <DatabaseOutlined />, label: "Inventory" },
  { key: "/admin/orders", icon: <ShoppingOutlined />, label: "Orders Queue" },
  { key: "/admin/history", icon: <TeamOutlined />, label: "Customer History" },
  { key: "/", icon: <LogoutOutlined />, label: "Exit" },
];

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuClick = (key: string) => {
    navigate(key);
    setDrawerOpen(false);
  };


  return (
    <AdminLayoutWrapper>
      <StyledSider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={80}
        width={200}
      >
        <AdminLogo justify="center" align="center">
          {collapsed ? "ADM" : "Admin"}
        </AdminLogo>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />

        <SiderFooter justify="center">
          <CollapseButton
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          >
            {!collapsed && ""}
          </CollapseButton>
        </SiderFooter>
      </StyledSider>

      <MainContentWrapper $collapsed={collapsed}>
        <StyledHeader>
          <HeaderLeft align="center">
            <MobileAdminMenuBtn
              icon={<MenuOutlined />}
              type="text"
              onClick={() => setDrawerOpen(true)}
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

      <AdminMobileDrawer
        placement="left"
        width={240}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={<span style={{ color: "#fff", fontWeight: 700 }}>Admin Menu</span>}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </AdminMobileDrawer>
    </AdminLayoutWrapper>
  );
};

export default AdminLayout;

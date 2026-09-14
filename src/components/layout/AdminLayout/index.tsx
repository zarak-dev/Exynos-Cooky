import React, { useState } from "react";
import { Drawer } from "antd";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminHeader } from "./components/AdminHeader";
import { TeamSwitcher } from "./components/TeamSwitcher";
import { NavMain } from "./components/NavMain";
import { NavQuickLinks } from "./components/NavQuickLinks";
import { NavUser } from "./components/NavUser";

const LayoutRoot = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #fbfbfb;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100vh;
  overflow: hidden;
`;

const MainScrollable = styled.main`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: #fbfbfb;
  -webkit-overflow-scrolling: touch;
`;

const MobileDrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px 0;
  justify-content: space-between;
`;

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <LayoutRoot>
      {/* Desktop Shadcn sidebar-07 */}
      <AdminSidebar collapsed={collapsed} />

      {/* Main Content Area */}
      <ContentArea>
        <AdminHeader
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onOpenMobileDrawer={() => setDrawerOpen(true)}
        />
        <MainScrollable>
          <Outlet />
        </MainScrollable>
      </ContentArea>

      {/* Mobile Drawer (Responsive < 768px) */}
      <Drawer
        placement="left"
        width={280}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        closable={false}
        styles={{
          body: {
            padding: "12px",
            background: "#ffffff",
          },
        }}
      >
        <MobileDrawerContent>
          <div>
            <TeamSwitcher />
            <div style={{ marginTop: 12 }}>
              <NavMain onNavigate={() => setDrawerOpen(false)} />
              <NavQuickLinks onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
          <div style={{ paddingTop: 12, borderTop: "1px solid #f4f4f5" }}>
            <NavUser />
          </div>
        </MobileDrawerContent>
      </Drawer>
    </LayoutRoot>
  );
};

export default AdminLayout;

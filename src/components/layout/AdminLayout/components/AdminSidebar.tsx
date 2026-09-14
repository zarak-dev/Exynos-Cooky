import React from "react";
import styled from "styled-components";
import { TeamSwitcher } from "./TeamSwitcher";
import { NavMain } from "./NavMain";
import { NavQuickLinks } from "./NavQuickLinks";
import { NavUser } from "./NavUser";

interface AdminSidebarProps {
  collapsed: boolean;
  onNavigate?: () => void;
}

const SidebarContainer = styled.aside<{ $collapsed: boolean }>`
  width: ${(props) => (props.$collapsed ? "64px" : "256px")};
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e4e4e7;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
  z-index: 50;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarHeader = styled.div<{ $collapsed: boolean }>`
  padding: 10px 8px;
  border-bottom: 1px solid #f4f4f5;
  flex-shrink: 0;
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  /* Custom subtle scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e4e4e7;
    border-radius: 4px;
  }
`;

const SidebarFooter = styled.div<{ $collapsed: boolean }>`
  padding: 10px 8px;
  border-top: 1px solid #f4f4f5;
  flex-shrink: 0;
  background: #ffffff;
`;

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onNavigate }) => {
  return (
    <SidebarContainer $collapsed={collapsed}>
      <SidebarHeader $collapsed={collapsed}>
        <TeamSwitcher collapsed={collapsed} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain collapsed={collapsed} onNavigate={onNavigate} />
        <NavQuickLinks collapsed={collapsed} onNavigate={onNavigate} />
      </SidebarContent>

      <SidebarFooter $collapsed={collapsed}>
        <NavUser collapsed={collapsed} />
      </SidebarFooter>
    </SidebarContainer>
  );
};

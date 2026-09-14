import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PanelLeft, ExternalLink, Menu as MenuIcon } from "lucide-react";
import styled from "styled-components";

interface AdminHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobileDrawer: () => void;
}

const HeaderWrapper = styled.header`
  height: 54px;
  background: #ffffff;
  border-bottom: 1px solid #e4e4e7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;

  @media (max-width: 576px) {
    padding: 0 12px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e4e4e7;
  background: #ffffff;
  color: #52525b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f4f4f5;
    color: #09090b;
    border-color: #d4d4d8;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e4e4e7;
  background: #ffffff;
  color: #52525b;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #f4f4f5;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Separator = styled.div`
  width: 1px;
  height: 16px;
  background: #e4e4e7;

  @media (max-width: 768px) {
    display: none;
  }
`;

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
`;

const BreadcrumbItem = styled.span<{ $active?: boolean }>`
  color: ${(props) => (props.$active ? "#09090b" : "#71717a")};
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  cursor: ${(props) => (props.$active ? "default" : "pointer")};
  transition: color 0.15s ease;

  &:hover {
    color: #09090b;
  }

  @media (max-width: 576px) {
    ${(props) =>
      !props.$active &&
      `
      display: none;
    `}
  }
`;

const BreadcrumbSlash = styled.span`
  color: #d4d4d8;
  user-select: none;

  @media (max-width: 576px) {
    display: none;
  }
`;

const StatusPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 500;
  color: #16a34a;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 3px 9px;
  border-radius: 9999px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #16a34a;
  box-shadow: 0 0 6px #22c55e;
`;

const ViewStoreLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: #52525b;
  background: transparent;
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f4f4f5;
    color: #09090b;
    border-color: #d4d4d8;
  }
`;

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  collapsed,
  onToggleCollapse,
  onOpenMobileDrawer,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    if (location.pathname.startsWith("/admin/inventory")) return "Inventory Management";
    if (location.pathname.startsWith("/admin/orders")) return "Orders Queue";
    if (location.pathname.startsWith("/admin/history")) return "Customer History";
    return "Dashboard Overview";
  };

  return (
    <HeaderWrapper>
      <HeaderLeft>
        <IconButton
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar (⌘B)" : "Collapse sidebar (⌘B)"}
        >
          <PanelLeft size={16} />
        </IconButton>
        <MobileMenuButton onClick={onOpenMobileDrawer}>
          <MenuIcon size={16} />
        </MobileMenuButton>
        <Separator />
        <BreadcrumbContainer>
          <BreadcrumbItem onClick={() => navigate("/admin")}>Admin</BreadcrumbItem>
          <BreadcrumbSlash>/</BreadcrumbSlash>
          <BreadcrumbItem $active>{getPageTitle()}</BreadcrumbItem>
        </BreadcrumbContainer>
      </HeaderLeft>

      <HeaderRight>
        <StatusPill>
          <Dot /> Kitchen Live
        </StatusPill>
        <ViewStoreLink onClick={() => navigate("/")}>
          <span>View Store</span>
          <ExternalLink size={13} />
        </ViewStoreLink>
      </HeaderRight>
    </HeaderWrapper>
  );
};

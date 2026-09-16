import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Cookie,
  ShoppingBag,
  Users,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import styled from "styled-components";
import { Tooltip } from "antd";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string | number;
  subItems?: { title: string; url: string }[];
}

interface NavMainProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

const NavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0;
`;

const GroupLabel = styled.div<{ $collapsed?: boolean }>`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #a1a1aa;
  padding: 6px 12px;
  user-select: none;

  ${(props) =>
    props.$collapsed &&
    `
    display: none;
  `}
`;

const NavButton = styled.button<{ $active?: boolean; $collapsed?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  background: ${(props) => (props.$active ? "#eef2ff" : "transparent")};
  color: ${(props) => (props.$active ? "#00009c" : "#52525b")};
  font-weight: ${(props) => (props.$active ? "600" : "500")};
  font-size: 13.5px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    background: #eef2ff;
    color: #00009c;

    span {
      color: #00009c;
    }
  }

  ${(props) =>
    props.$collapsed &&
    `
    justify-content: center;
    padding: 9px 0;
  `}
`;

const IconWrapper = styled.span<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.$active ? "#00009c" : "#71717a")};
  transition: color 0.15s ease;
`;

const NavTitle = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ActiveIndicator = styled.div`
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3.5px;
  background: #00009c;
  border-radius: 0 4px 4px 0;
`;

const Badge = styled.span<{ $active?: boolean }>`
  font-size: 10.5px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 9999px;
  background: ${(props) => (props.$active ? "#c7d2fe" : "#e0e7ff")};
  color: #00009c;
`;

export const NavMain: React.FC<NavMainProps> = ({ collapsed, onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      title: "Overview",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Inventory",
      url: "/admin/inventory",
      icon: Cookie,
      badge: "Active",
    },
    {
      title: "Orders Queue",
      url: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      title: "Customer History",
      url: "/admin/history",
      icon: Users,
    },
    {
      title: "Admin Profile",
      url: "/admin/profile",
      icon: UserCog,
    },
  ];

  const handleClick = (url: string) => {
    navigate(url);
    if (onNavigate) onNavigate();
  };

  return (
    <NavGroup>
      <GroupLabel $collapsed={collapsed}>Bakery Operations</GroupLabel>
      {navItems.map((item) => {
        const isActive =
          item.url === "/admin"
            ? location.pathname === "/admin"
            : location.pathname.startsWith(item.url);

        const buttonElement = (
          <NavButton
            key={item.url}
            $active={isActive}
            $collapsed={collapsed}
            onClick={() => handleClick(item.url)}
          >
            {isActive && !collapsed && <ActiveIndicator />}
            <IconWrapper $active={isActive}>
              <item.icon size={17} strokeWidth={isActive ? 2.2 : 1.9} />
            </IconWrapper>
            {!collapsed && (
              <>
                <NavTitle>{item.title}</NavTitle>
                {item.badge && <Badge $active={isActive}>{item.badge}</Badge>}
              </>
            )}
          </NavButton>
        );

        if (collapsed) {
          return (
            <Tooltip key={item.url} title={item.title} placement="right">
              {buttonElement}
            </Tooltip>
          );
        }

        return buttonElement;
      })}
    </NavGroup>
  );
};

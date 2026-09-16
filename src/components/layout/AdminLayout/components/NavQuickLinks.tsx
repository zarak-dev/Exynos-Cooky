import React from "react";
import { useNavigate } from "react-router-dom";
import { Store, Sparkles, Bell, ExternalLink, type LucideIcon } from "lucide-react";
import styled from "styled-components";
import { Tooltip } from "antd";

interface QuickLinkItem {
  title: string;
  url: string;
  icon: LucideIcon;
  external?: boolean;
}

interface NavQuickLinksProps {
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

const LinkButton = styled.button<{ $collapsed?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #52525b;
  font-weight: 500;
  font-size: 13.5px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;

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

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #71717a;
`;

const LinkTitle = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NavQuickLinks: React.FC<NavQuickLinksProps> = ({ collapsed, onNavigate }) => {
  const navigate = useNavigate();

  const links: QuickLinkItem[] = [
    {
      title: "Storefront View",
      url: "/",
      icon: Store,
      external: true,
    },
    {
      title: "AI Box Builder",
      url: "/buy-cooky",
      icon: Sparkles,
    },
    {
      title: "Live Order Tracker",
      url: "/track-order",
      icon: Bell,
    },
  ];

  const handleClick = (url: string) => {
    navigate(url);
    if (onNavigate) onNavigate();
  };

  return (
    <NavGroup>
      <GroupLabel $collapsed={collapsed}>Quick Access</GroupLabel>
      {links.map((link) => {
        const button = (
          <LinkButton
            key={link.title}
            $collapsed={collapsed}
            onClick={() => handleClick(link.url)}
          >
            <IconWrapper>
              <link.icon size={17} strokeWidth={1.9} />
            </IconWrapper>
            {!collapsed && (
              <>
                <LinkTitle>{link.title}</LinkTitle>
                {link.external && <ExternalLink size={13} style={{ color: "#a1a1aa" }} />}
              </>
            )}
          </LinkButton>
        );

        if (collapsed) {
          return (
            <Tooltip key={link.title} title={link.title} placement="right">
              {button}
            </Tooltip>
          );
        }

        return button;
      })}
    </NavGroup>
  );
};

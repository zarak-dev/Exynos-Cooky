import React from "react";
import { Dropdown, type MenuProps } from "antd";
import { ChevronsUpDown, Cookie, Check } from "lucide-react";
import styled from "styled-components";

interface TeamSwitcherProps {
  collapsed?: boolean;
}

const SwitcherButton = styled.button<{ $collapsed?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #eef2ff;
  }

  ${(props) =>
    props.$collapsed &&
    `
    justify-content: center;
    padding: 8px 4px;
  `}
`;

const LogoBox = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #00009c;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 156, 0.25);
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const StoreTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #09090b;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StoreSubtitle = styled.span`
  font-size: 11px;
  color: #71717a;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
`;

export const TeamSwitcher: React.FC<TeamSwitcherProps> = ({ collapsed }) => {
  const [selectedOutlet, setSelectedOutlet] = React.useState("Flagship Kitchen");

  const outlets = [
    { name: "Exynos Cooky", role: "Flagship Kitchen • Admin", key: "Flagship Kitchen" },
    { name: "Baking Production", role: "Central Oven • Command", key: "Central Oven" },
    { name: "Express Dispatch", role: "Logistics Hub", key: "Logistics Hub" },
  ];

  const items: MenuProps["items"] = [
    {
      key: "header",
      type: "group",
      label: <span style={{ fontSize: 11, color: "#a1a1aa", textTransform: "uppercase" }}>Bakery Locations</span>,
    },
    ...outlets.map((outlet) => ({
      key: outlet.key,
      label: (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "4px 0" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: "#09090b" }}>{outlet.name}</span>
            <span style={{ fontSize: 11, color: "#71717a" }}>{outlet.role}</span>
          </div>
          {selectedOutlet === outlet.key && <Check size={14} style={{ color: "#09090b" }} />}
        </div>
      ),
      onClick: () => setSelectedOutlet(outlet.key),
    })),
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomLeft">
      <SwitcherButton $collapsed={collapsed} title={collapsed ? "Exynos Cooky" : undefined}>
        <LogoBox>
          <Cookie size={18} strokeWidth={2.2} />
        </LogoBox>
        {!collapsed && (
          <>
            <TextContainer>
              <StoreTitle>Exynos Cooky</StoreTitle>
              <StoreSubtitle>{selectedOutlet}</StoreSubtitle>
            </TextContainer>
            <ChevronsUpDown size={15} style={{ color: "#71717a", flexShrink: 0 }} />
          </>
        )}
      </SwitcherButton>
    </Dropdown>
  );
};

import React from "react";
import { Dropdown, type MenuProps } from "antd";
import { ChevronsUpDown, LogOut, User, Sparkles, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@src/store";
import { logoutUser } from "@src/store/slices/authSlice";
import styled from "styled-components";

interface NavUserProps {
  collapsed?: boolean;
}

const UserButton = styled.button<{ $collapsed?: boolean }>`
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

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #00009c;
  color: #fafafa;
  font-weight: 600;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 156, 0.2);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

const UserName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #09090b;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserEmail = styled.span`
  font-size: 11px;
  color: #71717a;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
`;

export const NavUser: React.FC<NavUserProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const name = user?.name || "Admin Staff";
  const email = user?.email || "staff@exynoscooky.com";
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "AD";

  const menuItems: MenuProps["items"] = [
    {
      key: "user-info",
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 2px" }}>
          <Avatar style={{ width: 28, height: 28, fontSize: 11 }}>{initials}</Avatar>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: "#09090b" }}>{name}</span>
            <span style={{ fontSize: 11, color: "#71717a" }}>{email}</span>
          </div>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "badge",
      icon: <ShieldCheck size={15} style={{ color: "#16a34a" }} />,
      label: <span style={{ fontSize: 13 }}>Admin Privileges Verified</span>,
    },
    {
      key: "ai",
      icon: <Sparkles size={15} style={{ color: "#d97706" }} />,
      label: <span style={{ fontSize: 13 }}>Bakery AI Online</span>,
    },
    {
      key: "profile",
      icon: <User size={15} />,
      label: <span style={{ fontSize: 13 }}>Admin Profile & Security</span>,
      onClick: () => navigate("/admin/profile"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogOut size={15} style={{ color: "#ef4444" }} />,
      label: <span style={{ fontSize: 13, color: "#ef4444" }}>Exit Admin</span>,
      onClick: () => {
        dispatch(logoutUser());
        navigate("/");
      },
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="topRight">
      <UserButton $collapsed={collapsed} title={collapsed ? name : undefined}>
        <Avatar>{initials}</Avatar>
        {!collapsed && (
          <>
            <UserInfo>
              <UserName>{name}</UserName>
              <UserEmail>{email}</UserEmail>
            </UserInfo>
            <ChevronsUpDown size={15} style={{ color: "#71717a", flexShrink: 0 }} />
          </>
        )}
      </UserButton>
    </Dropdown>
  );
};

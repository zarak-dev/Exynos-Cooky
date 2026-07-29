import styled from "styled-components";
import { Layout, Menu, Button, Typography, Flex, Drawer } from "antd";
import { NavLink } from "react-router-dom";

const { Header } = Layout;
const { Text } = Typography;

export const StyledHeader = styled(Header)`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: 64px;
  border-bottom: 1px solid rgba(240, 240, 240, 0.8);
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  @media (max-width: 992px) {
    padding: 0 20px;
  }
`;

export const LeftContainer = styled(Flex)`
  flex: 1;
  align-items: center;
`;

export const LogoContainer = styled(NavLink)`
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  .ant-image-img {
    object-fit: contain;
    display: block;
  }
  &:hover {
    transform: scale(1.02);
  }
`;

export const DesktopMenu = styled(Menu)`
  border: none;
  background: transparent;
  flex: 1;
  justify-content: center;
  line-height: 64px;
  min-width: max-content;

  .ant-menu-item {
    color: #00009c !important;
    font-weight: 600 !important;
    font-size: 1.05rem !important;
    position: relative;
    transition: color 0.2s ease;
  }

  .ant-menu-item:hover {
    color: #000066 !important;
    background-color: transparent !important;
  }

  .ant-menu-item-selected {
    font-weight: 800 !important;
  }

  .ant-menu-item::after,
  .ant-menu-item:hover::after,
  .ant-menu-item-selected::after,
  .ant-menu-item-active::after {
    display: none !important;
    border: none !important;
  }

  .ant-menu-item::before {
    content: "";
    position: absolute;
    bottom: 14px;
    left: 16px;
    right: 16px;
    height: 2px;
    background-color: #00009c;
    border-radius: 2px;
    transform: scaleX(0) translateZ(0);
    transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    will-change: transform;
  }

  .ant-menu-item:hover::before {
    transform: scaleX(1) translateZ(0);
  }

  @media (max-width: 992px) {
    display: none;
  }
`;

export const MobileMenuButton = styled(Button)`
  display: none;
  border: none;
  background: transparent;
  color: #00009c;
  .anticon {
    font-size: 1.4rem;
  }

  @media (max-width: 992px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const IconActions = styled(Flex)`
  flex: 1;
  justify-content: flex-end;
  gap: 24px;
  align-items: center;

  @media (max-width: 992px) {
    gap: 16px;
  }
`;

export const SearchWrapper = styled(Flex)`
  align-items: center;
  gap: 8px;
`;


export const ActionIcon = styled.div`
  color: #00009c;
  font-size: 1.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.7;
  }
`;

export const CartIcon = styled(ActionIcon)`
  font-size: 1.6rem;
`;

export const RoleText = styled(Text)<{ $isAdmin?: boolean }>`
  color: ${(props) => (props.$isAdmin ? "#d92323" : "#00009c")};
  text-transform: uppercase;
`;

export const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 0 !important;
  }
`;

export const MobileDrawerMenu = styled(DesktopMenu)`
  display: block !important;
  border-right: none !important;
`;

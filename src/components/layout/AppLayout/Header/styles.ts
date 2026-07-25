import styled from 'styled-components';
import { Layout, Menu, Input, Button, Typography, Flex, Drawer } from 'antd';
import { NavLink } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

export const StyledHeader = styled(Header)`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  box-sizing: border-box; /* 🌟 CRITICAL FIX: Stops the padding from breaking the 100% width */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: 80px;
  border-bottom: 1px solid rgba(240, 240, 240, 0.8);
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  @media (max-width: 768px) {
    padding: 0 20px;
  }
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

/* 🌟 DESKTOP MENU: Hides on screens smaller than 768px */
export const DesktopMenu = styled(Menu)`
  border: none;
  background: transparent;
  flex: 1;
  justify-content: center;

  /* 🌟 GLOBAL MENU ITEM STYLES */
  .ant-menu-item {
    color: #00009c !important;
    font-weight: 600 !important;
    font-size: 1.05rem !important;
    position: relative; /* Required for the custom underline positioning */
    transition: color 0.2s ease;
  }

  .ant-menu-item:hover {
    color: #000066 !important;
    background-color: transparent !important;
  }

  .ant-menu-item-selected {
    font-weight: 800 !important;
  }

  /* 🌟 1. KILL DEFAULT ANT DESIGN UNDERLINE */
  &.ant-menu-horizontal > .ant-menu-item::after,
  &.ant-menu-horizontal > .ant-menu-submenu::after {
    display: none !important;
  }

  .ant-menu-item::before {
    content: '';
    position: absolute;
    bottom: 0px; /* 🌟 CRITICAL FIX: Pushed the line all the way to the bottom edge */
    left: 16px; /* Aligning strictly with Ant Design's default padding */
    right: 16px;
    height: 1.5px;
    background-color: #00009c;
    border-radius: 2px;
    
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  }

  /* 🌟 3. TRIGGER ANIMATION ON HOVER AND ACTIVE STATE */
  .ant-menu-item:hover::before {
    transform: scaleX(1);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

/* 🌟 MOBILE MENU BUTTON (Hamburger): Shows ONLY on screens smaller than 768px */
export const MobileMenuButton = styled(Button)`
  display: none;
  border: none;
  background: transparent;
  color: #00009c;
  .anticon {
    font-size: 1.4rem; 
  }
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const IconActions = styled(Flex)`
  gap: 24px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

export const SearchWrapper = styled(Flex)`
  align-items: center;
  gap: 8px;
`;

export const HeaderSearchInput = styled(Input)`
  width: 160px;
  border-radius: 0px;
  border-color: #00009c;
  font-family: "Poppins", sans-serif;
  font-size: 0.85rem;
  height: 32px;
  transition: all 0.3s ease;

  &:focus,
  &:hover {
    border-color: #000066 !important;
    box-shadow: none !important;
  }

  @media (max-width: 768px) {
    width: 120px; /* Smaller input on mobile to prevent squishing */
  }
`;

/* --- Interactive Icons & Typography --- */
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
  font-size: 1.6rem; /* Slightly larger cart icon */
`;

export const RoleText = styled(Text)<{ $isAdmin?: boolean }>`
  color: ${(props) => (props.$isAdmin ? '#d92323' : '#00009c')};
  text-transform: uppercase;
`;

export const AdminMenuText = styled(Text)`
  font-weight: 700;
  color: #00009c;
`;

export const DrawerTitleText = styled(Typography.Text)`
  color: #00009c;
`;

export const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 0 !important;
  }
`;

// Extends your existing DesktopMenu to override its mobile hidden state
export const MobileDrawerMenu = styled(DesktopMenu)`
  display: block !important;
  border-right: none !important;
`;
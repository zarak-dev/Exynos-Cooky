import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Badge, message, Image, Typography, Flex } from "antd";
import { 
  SearchOutlined, 
  UserOutlined, 
  ShoppingOutlined, 
  MenuOutlined 
} from "@ant-design/icons";

import { toggleAuthModal, logoutUser } from "../../../../store/slices/authSlice";
import { type RootState } from "../../../../store";
import { useSearch } from "../../../../context/searchContext";
import logoSvg from "../../../../assets/images/exynos-cooky.svg";

import {
  StyledHeader, LogoContainer, DesktopMenu, MobileMenuButton, 
  IconActions, SearchWrapper, HeaderSearchInput, ActionIcon, 
  CartIcon, RoleText, AdminMenuText, DrawerTitleText, StyledDrawer, MobileDrawerMenu
} from "./styles";

const { Text } = Typography;

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalCartCount = cartItems ? cartItems.length : 0;
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  
  const { searchQuery, setSearchQuery } = useSearch();
  const [showInput, setShowInput] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const userMenu = {
    items: [
      {
        key: "profile",
        label: (
          <Text>
            Role: <RoleText strong $isAdmin={user?.role === "admin"}>{user?.role}</RoleText>
          </Text>
        ),
        disabled: true,
      },
      ...(user?.role === "admin"
        ? [
            {
              key: "admin-dashboard",
              label: <AdminMenuText>🛠️ Admin Dashboard</AdminMenuText>,
              onClick: () => navigate("/admin"),
            },
          ]
        : []),
      { type: "divider" as const },
      {
        key: "logout",
        label: "Log Out",
        danger: true,
        onClick: () => {
          dispatch(logoutUser());
          message.info("Logged out smoothly.");
        },
      },
    ],
  };

  const navItems = [
    { key: "/", label: "Weekly Menu" },
    { key: "/about", label: "Our Story" },
    { key: "/track-order", label: "Track Order" },
    { key: "/careers", label: "Careers" },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false); 
  };

  return (
    <StyledHeader>
      
     <Flex align="center" gap="middle">
        <MobileMenuButton 
          icon={<MenuOutlined />} 
          onClick={() => setIsMobileMenuOpen(true)} 
        />

        <LogoContainer to="/">
          <Image 
            src={logoSvg} 
            alt="logo" 
            preview={false}
            width={140}
          />
        </LogoContainer>
      </Flex>

      {/* 🌟 3. Desktop Menu (Hidden on mobile) */}
      <DesktopMenu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={navItems}
        onClick={(info) => handleNavClick(info.key)}
      />

      {/* 🌟 4. Action Icons (Cart, User, Search) */}
      <IconActions>
        <SearchWrapper>
          {showInput && (
            <HeaderSearchInput
              placeholder="Search cookies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              onBlur={() => {
                if (!searchQuery.trim()) {
                  setShowInput(false);
                }
              }}
            />
          )}
          <ActionIcon onClick={() => setShowInput(!showInput)}>
            <SearchOutlined />
          </ActionIcon>
        </SearchWrapper>

        {isLoggedIn ? (
          <Dropdown menu={userMenu} placement="bottomRight" arrow>
            <ActionIcon><UserOutlined /></ActionIcon>
          </Dropdown>
        ) : (
          <ActionIcon onClick={() => dispatch(toggleAuthModal())}>
            <UserOutlined />
          </ActionIcon>
        )}

        <Badge 
          count={totalCartCount} 
          size="small" 
          offset={[2, 0]} 
          color="#fa8c16" 
        >
          <CartIcon onClick={() => navigate("/cart")}>
            <ShoppingOutlined />
          </CartIcon>
        </Badge>
      </IconActions>

      {/* 🌟 5. Mobile Slide-out Drawer */}
      <StyledDrawer
        title={<DrawerTitleText strong>Menu</DrawerTitleText>}
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        width={250}
      >
        <MobileDrawerMenu
          mode="vertical" 
          selectedKeys={[location.pathname]}
          items={navItems}
          onClick={(info) => handleNavClick(info.key)}
        />
      </StyledDrawer>

    </StyledHeader>
  );
};

export default Header;
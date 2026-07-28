import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Badge, message, Image, Typography } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  ShoppingOutlined,
  MenuOutlined,
} from "@ant-design/icons";

import {
  toggleAuthModal,
  logoutUser,
} from "../../../../store/slices/authSlice";
import { type RootState } from "../../../../store";
import { useSearch } from "../../../../context/searchContext";
import logoSvg from "../../../../assets/images/exynos-cooky.svg";

import {
  StyledHeader,
  LeftContainer,
  LogoContainer,
  DesktopMenu,
  MobileMenuButton,
  IconActions,
  SearchWrapper,
  HeaderSearchInput,
  ActionIcon,
  CartIcon,
  AdminMenuText,
  DrawerTitleText,
  StyledDrawer,
  MobileDrawerMenu,
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
        key: "profile-info",
        label: (
          <Text>
            Hi, <Text strong>{user?.name}</Text>
          </Text>
        ),
        disabled: true,
      },
      { type: "divider" as const },
      ...(user?.role === "admin"
        ? [
            {
              key: "admin-dashboard",
              label: <AdminMenuText>🛠️ Admin Dashboard</AdminMenuText>,
              onClick: () => navigate("/admin"),
            },
          ]
        : [
            {
              key: "customer-profile",
              label: "👤 My Profile & Orders",
              onClick: () => navigate("/profile"),
            },
          ]),
      { type: "divider" as const },
      {
        key: "logout",
        label: "Log Out",
        danger: true,
        onClick: () => {
          dispatch(logoutUser());
          message.info("Logged out!");
          navigate("/");
        },
      },
    ],
  };

  const navItems = [
    { key: "/", label: "Home" },
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
      <LeftContainer gap="middle">
        <MobileMenuButton
          icon={<MenuOutlined />}
          onClick={() => setIsMobileMenuOpen(true)}
        />

        <LogoContainer to="/">
          <Image src={logoSvg} alt="logo" preview={false} width={140} />
        </LogoContainer>
      </LeftContainer>

      <DesktopMenu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={navItems}
        onClick={(info) => handleNavClick(info.key)}
        disabledOverflow
      />

      <IconActions>
        {isLoggedIn ? (
          <Dropdown
            menu={userMenu}
            placement="bottomRight"
            arrow
            trigger={["click"]}
          >
            <ActionIcon>
              <UserOutlined />
            </ActionIcon>
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

      <StyledDrawer
        title={<DrawerTitleText strong>Menu</DrawerTitleText>}
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        size={250}
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

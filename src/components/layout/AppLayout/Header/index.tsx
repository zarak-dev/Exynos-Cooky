import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Badge, message, Image, Typography, Tooltip } from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  MenuOutlined,
  AimOutlined,
} from "@ant-design/icons";

import {
  setOpenAuthModal,
  logoutUser,
} from "@src/store/slices/authSlice";
import { type RootState } from "@src/store";
import logoSvg from "@src/assets/images/exynos-favicon.png";

import {
  StyledHeader,
  LogoContainer,
  LogoWrapper,
  LeftMenu,
  LeftMenuWrapper,
  RightMenu,
  RightMenuWrapper,
  MobileMenuButton,
  IconActions,
  ActionIcon,
  CartIcon,
  TrackIcon,
  StyledDrawer,
  MobileDrawerMenu,
} from "./styles";

const { Text } = Typography;

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const totalCartCount = useSelector(
    (state: RootState) => state.cart.items.length,
  );
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const userMenu = useMemo(
    () => ({
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
                label: <Text>Admin Dashboard</Text>,
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
            message.info({
              content: "You have been logged out.",
              key: "auth_feedback",
            });
          },
        },
      ],
    }),
    [user?.name, user?.role, navigate, dispatch],
  );

  const leftNavItems = [
    { key: "/", label: "Home" },
    { key: "/buy-cooky", label: "Buy Cooky" },
  ];

  const rightNavItems = [
    { key: "/about", label: "Our Story" },
    { key: "/careers", label: "Careers" },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <StyledHeader>
      <MobileMenuButton
        icon={<MenuOutlined />}
        aria-label="Open navigation menu"
        onClick={() => setIsMobileMenuOpen(true)}
      />

      <LeftMenuWrapper>
        <LeftMenu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={leftNavItems}
          onClick={(info) => handleNavClick(info.key)}
          disabledOverflow
        />
      </LeftMenuWrapper>

      <LogoWrapper>
        <LogoContainer to="/">
          <Image
            src={logoSvg}
            alt="Exynos Cooky Logo"
            preview={false}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </LogoContainer>
      </LogoWrapper>

      <RightMenuWrapper>
        <RightMenu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={rightNavItems}
          onClick={(info) => handleNavClick(info.key)}
          disabledOverflow
        />
      </RightMenuWrapper>

      <IconActions>
        <Tooltip title="Track Order">
          <TrackIcon
            aria-label="Track Order"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/track-order")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/track-order");
              }
            }}
          >
            <AimOutlined />
          </TrackIcon>
        </Tooltip>

        <Badge
          count={totalCartCount}
          size="small"
          offset={[2, 0]}
          color="#fa8c16"
        >
          <CartIcon
            aria-label="Shopping Cart"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/cart")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate("/cart");
              }
            }}
          >
            <ShoppingOutlined />
          </CartIcon>
        </Badge>

        {isLoggedIn ? (
          <Dropdown
            menu={userMenu}
            placement="bottomRight"
            arrow
            trigger={["click"]}
          >
            <ActionIcon
              aria-label="User profile and account menu"
              role="button"
              tabIndex={0}
            >
              <UserOutlined />
            </ActionIcon>
          </Dropdown>
        ) : (
          <ActionIcon
            aria-label="Log in or sign up"
            role="button"
            tabIndex={0}
            onClick={() => dispatch(setOpenAuthModal(true))}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                dispatch(setOpenAuthModal(true));
              }
            }}
          >
            <UserOutlined />
          </ActionIcon>
        )}
      </IconActions>

      <StyledDrawer
        title={<Text strong>Menu</Text>}
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        width={280}
      >
        <MobileDrawerMenu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={[...leftNavItems, ...rightNavItems]}
          onClick={(info) => handleNavClick(info.key)}
        />
      </StyledDrawer>
    </StyledHeader>
  );
};

export default Header;

// src/components/layout/header.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
// If you want to use Ant Design Icons for the right side elements:
import { SearchOutlined, UserOutlined, ShoppingOutlined } from '@ant-design/icons';

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
`;

const LogoContainer = styled(NavLink)`
  font-size: 1.8rem;
  font-weight: 800;
  color: #00009c; /* Pristine navy blue from image_4549dd.png */
  text-decoration: none;
  font-family: 'Poppins', 'Inter', -apple-system, sans-serif; /* Modern, clean, stylish font stack */
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 8px; /* Perfectly spaces the text from the emoji */
  transition: transform 0.2s ease;

  &:hover {
    color: #000066; /* Darkens slightly on hover */
    transform: scale(1.02); /* Subtle stylish bounce on hover */
  }

  span, &::after {
    font-size: 2rem;
  }
`;

const NavMenu = styled.nav`
  display: flex;
  gap: 32px;
`;

const NavigationLink = styled(NavLink)`
  font-size: 0.9rem;
  font-weight: 700;
  color: #00009c; /* Bold Navy links */
  text-decoration: none;
  text-transform: uppercase; /* Match the capitalization in image_4549dd.png */
  letter-spacing: 0.5px;
  transition: opacity 0.2s ease;
  padding-bottom: 4px;

  &:hover {
    opacity: 0.7;
  }

  &.active {
    border-bottom: 2px solid #00009c; /* Clean solid accent underline */
  }
`;

const IconActions = styled.div`
  display: flex;
  gap: 24px;
  color: #00009c;
  font-size: 1.4rem;
  cursor: pointer;

  span:hover {
    opacity: 0.7;
  }
`;

const Header: React.FC = () => {
  return (
    <StyledHeader>
      <LogoContainer to="/">
        Exynos Cooky 🍪
      </LogoContainer>
      
      <NavMenu>
        <NavigationLink to="/">Weekly Menu</NavigationLink>
        <NavigationLink to="/about">Our Story</NavigationLink>
        <NavigationLink to="/delivery">Local Delivery</NavigationLink>
        <NavigationLink to="/contact">Careers</NavigationLink>
      </NavMenu>

      {/* Matching the utility icons on the right side of image_4549dd.png */}
      <IconActions>
        <SearchOutlined />
        <UserOutlined />
        <ShoppingOutlined />
      </IconActions>
    </StyledHeader>
  );
};

export default Header;
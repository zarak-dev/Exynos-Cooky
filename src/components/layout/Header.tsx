// src/components/layout/header.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import logoSvg from '../../assets/images/exynos-cooky.svg';
// If you want to use Ant Design Icons for the right side elements:
import { SearchOutlined, UserOutlined, ShoppingOutlined } from '@ant-design/icons';

const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
  background-color: #ffffff;
  border-bottom: 1px solid rgba(240, 240, 240, 0.3); 
  background-color: rgba(255, 255, 255, 0.55);       
  backdrop-filter: blur(12px);                       
  -webkit-backdrop-filter: blur(12px);
`;

const LogoContainer = styled(NavLink)`
  font-size: 1.8rem;
  font-weight: 800;
  color: #00009c;
  text-decoration: none;
  font-family:   -apple-system, sans-serif; 
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 8px; 
  transition: transform 0.2s ease;

  &:hover {
    color: #000066; 
    transform: scale(1.02); 
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
  color: #00009c;
  text-decoration: none;
  text-transform: uppercase; 
  letter-spacing: 0.5px;
  font-family: 'Poppins', sans-serif;
  transition: opacity 0.2s ease;
  padding-bottom: 4px;

  &:hover {
    opacity: 0.7;
  }

  &.active {
    border-bottom: 2px solid #00009c; 
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
       <img src={logoSvg} alt="logo" style={{ width: '190px', height: '40px', display: 'block', objectFit: 'contain' }} />
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
// src/components/layout/header.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Input } from 'antd'; // Added for the collapsing search drawer effect
import logoSvg from '../../assets/images/exynos-cooky.svg';
import { useSearch } from '../../context/searchContext'; // Connect global search state
import { SearchOutlined, UserOutlined, ShoppingOutlined } from '@ant-design/icons';

const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%; /* Changed from 90% to 100% to fill out screen nicely like original layout */
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
  border-bottom: 1px solid rgba(240, 240, 240, 0.8); 
  background-color: rgba(255, 255, 255, 0.85);       
  backdrop-filter: blur(12px);                      
  -webkit-backdrop-filter: blur(12px);
`;

const LogoContainer = styled(NavLink)`
  font-size: 1.8rem;
  font-weight: 800;
  color: #00009c;
  text-decoration: none;
  font-family: -apple-system, sans-serif; 
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 8px; 
  transition: transform 0.2s ease;

  &:hover {
    color: #000066; 
    transform: scale(1.02); 
  }
`;

const NavMenu = styled.nav`
  display: flex;
  gap: 32px;
  align-items: center;
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
  align-items: center;

  span:hover {
    opacity: 0.7;
  }
`;

/* Styled component to inject into actions layout box for sleek entry animation */
const HeaderSearchInput = styled(Input)`
  width: 160px;
  border-radius: 0px;
  border-color: #00009c;
  font-family: 'Poppins', sans-serif;
  font-size: 0.85rem;
  height: 32px;
  transition: all 0.3s ease;

  &:focus, &:hover {
    border-color: #000066 !important;
    box-shadow: none !important;
  }
`;

const Header: React.FC = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [showInput, setShowInput] = useState<boolean>(false);

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

      <IconActions>
        {/* Dynamic Expandable Utility Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {showInput && (
            <HeaderSearchInput
              placeholder="Search cookies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              onBlur={() => {
                // Collapse search input box automatically if user leaves it blank
                if (!searchQuery.trim()) {
                  setShowInput(false);
                }
              }}
            />
          )}
          <SearchOutlined onClick={() => setShowInput(!showInput)} style={{ cursor: 'pointer' }} />
        </div>
        
        <UserOutlined />
        <ShoppingOutlined />
      </IconActions>
    </StyledHeader>
  );
};

export default Header;
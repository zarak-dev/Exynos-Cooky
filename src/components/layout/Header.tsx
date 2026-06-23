import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAuthModal, logoutUser } from '../../store/authSlice';
import { type RootState } from '../../store';
import { toggleCart } from '../../store/cartSlice';
import styled from 'styled-components';
import { Input,  Dropdown, Menu, message  } from 'antd';
import logoSvg from '../../assets/images/exynos-cooky.svg';
import { useSearch } from '../../context/searchContext'; // Connect global search state
import { SearchOutlined, UserOutlined, ShoppingOutlined } from '@ant-design/icons';

const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const { searchQuery, setSearchQuery } = useSearch();
  const [showInput, setShowInput] = useState<boolean>(false);

  const userMenu = {
    items: [
      {
        key: 'profile',
        label: (
          <span>
            Role: <strong style={{ color: user?.role === 'admin' ? '#d92323' : '#00009c', textTransform: 'uppercase' }}>
              {user?.role}
            </strong>
          </span>
        ),
        disabled: true,
      },

      ...(user?.role === 'admin' ? [
        {
          key: 'admin-dashboard',
          label: <span style={{ fontWeight: 700, color: '#00009c' }}>🛠️ Admin Dashboard</span>,
          onClick: () => {
            navigate('/admin');
          }
        }
      ] : []),
      {
        type: 'divider' as const,
      },
      {
        key: 'logout',
        label: 'Log Out',
        danger: true,
        onClick: () => {
          dispatch(logoutUser());
          message.info("Logged out smoothly.");
        },
      },
    ],
  };
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
        {isLoggedIn ? (
        <Dropdown  menu={userMenu} placement="bottomRight" arrow>
          <UserOutlined style={{ color: '#00009c', cursor: 'pointer' }} />
        </Dropdown>
      ) : (
         <UserOutlined onClick={() => dispatch(toggleAuthModal())} style={{ cursor: 'pointer' }} />)}
       <ShoppingOutlined 
          onClick={() => dispatch(toggleCart())} 
          style={{ cursor: 'pointer' }} 
        />
      </IconActions>
    </StyledHeader>
  );
};

export default Header;
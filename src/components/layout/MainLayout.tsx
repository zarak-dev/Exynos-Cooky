import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { AuthModal } from '../common/AuthModal';
import { CartDrawer } from '../common/CartDrawer';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;
`;

const ContentArea = styled.main`
  flex: 1;
  width: 100%;
`;

const MainLayout: React.FC = () => {
  return (
    <LayoutWrapper>
      <Header />
      <ContentArea>
        <Outlet /> {/* dynamically renders whatever page you are currently on! */}
      </ContentArea>
      <AuthModal/>
      <CartDrawer />
      <Footer />
    </LayoutWrapper>
  );
};

export default MainLayout;
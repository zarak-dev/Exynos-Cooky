// src/components/layout/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './header';
//import Footer from './Footer';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fffafb;
`;

const ContentArea = styled.main`
  flex: 1; /* Pushes the footer to the bottom of the page if content is short */
  width: 100%;
`;

const MainLayout: React.FC = () => {
  return (
    <LayoutWrapper>
      <Header />
      <ContentArea>
        <Outlet /> {/* This dynamically renders whatever page you are currently on! */}
      </ContentArea>
      
    </LayoutWrapper>
  );
};

export default MainLayout;
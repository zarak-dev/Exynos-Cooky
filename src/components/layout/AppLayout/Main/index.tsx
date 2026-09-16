import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@src/components/layout/AppLayout/Header";
import Footer from "@src/components/layout/AppLayout/Footer";
import { AuthModal } from "@src/components/common/Auth";
import { CartDrawer } from "@src/components/common/CartDrawer";
import { LayoutWrapper, ContentArea } from "./styles";
import InfoBar from "@src/components/common/InfoBar";

import { CookyAIAssistant } from "@src/components/customer/CookyAIAssistant";

const MainLayout: React.FC = () => {
  return (
    <LayoutWrapper>
      <Header />
      <ContentArea>
        {/* Dynamically renders whatever page you are currently on */}
        <Outlet />
      </ContentArea>
      <AuthModal />
      <CartDrawer />
      <InfoBar />
      <CookyAIAssistant />
      <Footer />
    </LayoutWrapper>
  );
};

export default MainLayout;

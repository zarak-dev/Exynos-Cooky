import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import AdminOverview from '../pages/AdminPanel';
import AdminInventory from '../pages/AdminInventory';
import AdminOrders from '../pages/AdminPanel/Components/AdminOrders';
import MainLayout from '../components/layout/Main';
import { AdminLayout } from '../components/layout/Admin';
import Home from '../pages/Home';
import AboutUs from '../pages/AboutUs';
import Careers from '../pages/Careers';
import CartPage from '../pages/Cart';
import {CheckoutPage} from '../pages/Checkout';
import TrackOrder from '../pages/TrackOrder';
import ScrollToTop from '../utils/scrollToTop';
import { UserHistory } from '../pages/AdminPanel/Components/UserHistory';


export const AppRoute: React.FC = () => {
  // Grab the logged-in user profile from Redux store
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  return (
      <>
      <ScrollToTop />
      <Routes>
        {/*  STOREFRONT LAYOUT GROUP */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="careers" element={<Careers />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>

      {/* ADMIN WORKSPACE LAYOUT GROUP */}
      <Route 
        path="/admin" 
        element={
          isLoggedIn && user?.role === 'admin' ? (
            <AdminLayout />
          ) : (
            <Navigate to="/" replace />
          )
        }
      >
        {/* Sub-paths of AdminLayout */}
        <Route index element={<AdminOverview />} />
        <Route path="inventory" element={<AdminInventory />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="history" element={<UserHistory />} />
      </Route>
      {/* Catch-all fallback route redirects broken URLs back home */}
      <Route path="*"  element={<Navigate to="/" replace />} />
    </Routes>
      </>
  );
};

export default AppRoute;
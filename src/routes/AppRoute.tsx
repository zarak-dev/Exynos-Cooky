import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';
import AdminOverview from '../pages/AdminOverview';
import AdminInventory from '../pages/AdminInventory';
import AdminOrders from '../pages/AdminOrders';
import MainLayout from '../components/layout/MainLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import Home from '../pages/Home';
import AboutUs from '../pages/aboutUs';
import Contact from '../pages/contact';
import Delivery from '../pages/delivery';
import Careers from '../pages/contact';


export const AppRoute: React.FC = () => {
  // Grab the logged-in user profile from our secure Redux store
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {/*  STOREFRONT LAYOUT GROUP */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="contact" element={<Contact />} />
        <Route path="delivery" element={<Delivery />} />
        <Route path="careers" element={<Careers />} />
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
      </Route>
      {/* Catch-all fallback route redirects broken URLs back home */}
      <Route path="*"  element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoute;
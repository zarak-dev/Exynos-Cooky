// src/routes/AppRoute.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import AboutUs from '../pages/aboutUs';
import  Delivery from '../pages/delivery';
import Contact from '../pages/contact';
import MainLayout from '../components/layout/MainLayout.tsx'; // We will create this next

const AppRoute: React.FC = () => {
  return (
    <Routes>
      {/* All routes inside here will automatically render the Header/Footer */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="delivery" element={<Delivery />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
};

export default AppRoute;
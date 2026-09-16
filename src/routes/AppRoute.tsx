import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "@src/components/layout/AppLayout/Main";
import ScrollToTop from "@src/utils/scrollToTop";
import ProtectedRoute from "./ProtectedRoute";
import { PageLoader } from "@src/components/common/PageTransitionLoader";

// Lazy-loaded pages for optimal chunking and authentic network loading on Vercel
const Home = lazy(() => import("@src/pages/customer/Home"));
const AboutUs = lazy(() => import("@src/pages/customer/AboutUs"));
const Careers = lazy(() => import("@src/pages/customer/Careers"));
const CartPage = lazy(() => import("@src/pages/customer/Cart"));
const CheckoutPage = lazy(() =>
  import("@src/pages/customer/Checkout").then((m) => ({ default: m.CheckoutPage })),
);
const TrackOrder = lazy(() => import("@src/pages/customer/TrackOrder"));
const CustomerProfile = lazy(() => import("@src/pages/customer/Profile"));
const BuyCooky = lazy(() => import("@src/pages/customer/BuyCooky"));

const AdminLayout = lazy(() =>
  import("@src/components/layout/AdminLayout").then((m) => ({
    default: m.AdminLayout,
  })),
);
const AdminOverview = lazy(() => import("@src/pages/admin/Overview/index"));
const AdminInventory = lazy(() => import("@src/pages/admin/Inventory/index"));
const AdminOrders = lazy(() => import("@src/pages/admin/Orders"));
const UserHistory = lazy(() => import("@src/pages/admin/UserHistory"));
const LoginPage = lazy(() => import("@src/pages/auth/LoginPage"));
const SignupPage = lazy(() => import("@src/pages/auth/SignupPage"));

const AppRoute = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader text="Loading Exynos Cooky..." />}>
        <Routes>
          {/* AUTH ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* STOREFRONT LAYOUT GROUP */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="buy-cooky" element={<BuyCooky />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="track-order" element={<TrackOrder />} />
            <Route path="careers" element={<Careers />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<CustomerProfile />} />
            </Route>
          </Route>

          {/* ADMIN WORKSPACE LAYOUT GROUP */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="history" element={<UserHistory />} />
            </Route>
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoute;

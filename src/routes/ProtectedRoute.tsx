import { Navigate, Outlet } from "react-router";
import type { RootState } from "../store";
import { useSelector } from "react-redux";
import type { UserRole } from "../store/slices/authSlice";


export const ProtectedRoute = ({ role }: { role?: UserRole }) => {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
};
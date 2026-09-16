import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "@src/store";
import { type UserRole } from "@src/store/slices/authSlice";
import { PageLoader } from "@src/components/common/PageTransitionLoader";

interface ProtectedRouteProps {
  role?: UserRole;
}

const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
  const { isLoggedIn, user, isRestoringSession } = useSelector(
    (state: RootState) => state.auth,
  );

  if (isRestoringSession) {
    return <PageLoader text="Verifying authentication..." />;
  }

  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;

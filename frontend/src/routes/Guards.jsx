import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const loc = useLocation();
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: loc }} replace />;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const loc = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

export const GuestRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated)
    return <Navigate to={user?.role === "admin" ? "/admin" : "/"} replace />;
  return children;
};

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute() {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!admin) return <Navigate to="/admin/login" state={{ from: location }} replace />;

  return <Outlet />;
}

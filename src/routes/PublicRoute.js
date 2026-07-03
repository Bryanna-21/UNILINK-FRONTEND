import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Outlet />;
  }

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin" replace />;

    case "lecturer":
      return <Navigate to="/lecturer" replace />;

    default:
      return <Navigate to="/student" replace />;
  }
}

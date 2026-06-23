import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleGuard({
children,
allowedRoles,
}) {
const { user } = useAuth();

if (!user) {
return <Navigate to="/" replace />;
}

if (!allowedRoles.includes(user.role)) {
return <Navigate to="/feed" replace />;
}

return children;
}

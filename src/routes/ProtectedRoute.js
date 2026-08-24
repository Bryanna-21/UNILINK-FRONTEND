import { Navigate,Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function ProtectedRoute(){const {isAuthenticated,user}=useAuth();if(!isAuthenticated)return <Navigate to="/login" replace/>;if(user?.role!=="student")return <Navigate to="/unauthorized" replace/>;return <Outlet/>;}

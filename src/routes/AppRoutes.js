import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleGuard from "./RoleGuard";

/* ---------- AUTH ---------- */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* ---------- LAYOUT ---------- */
import MainLayout from "../layouts/MainLayout";

/* ---------- DASHBOARDS ---------- */
import StudentDashboard from "../pages/student/Dashboard";
import LecturerDashboard from "../pages/lecturer/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";

/* ---------- COMMON PAGES ---------- */
import Feed from "../pages/Feed";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import Communities from "../pages/Communities";
import CreateCommunity from "../pages/CreateCommunity";
import Events from "../pages/Events";
import CreateEvent from "../pages/CreateEvent";
import Search from "../pages/Search";
import Messages from "../pages/Messages";
import ChatRoom from "../pages/ChatRoom";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";

/* ---------- UTILITY PAGES ---------- */
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          
          {/* Dashboards */}
          <Route
            path="/student"
            element={
              <RoleGuard roles={["student"]}>
                <StudentDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/lecturer"
            element={
              <RoleGuard roles={["lecturer"]}>
                <LecturerDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/admin"
            element={
              <RoleGuard roles={["admin"]}>
                <AdminDashboard />
              </RoleGuard>
            }
          />

          {/* Common Portal Pages */}
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/communities/create" element={<CreateCommunity />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/search" element={<Search />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/chat/:id" element={<ChatRoom />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />

        </Route>
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

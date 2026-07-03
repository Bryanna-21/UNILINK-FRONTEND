import { Suspense } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";

import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/StudentDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Communities from "./pages/Communities";
import ChatRoom from "./pages/ChatRoom";
import Events from "./pages/Events";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Search from "./pages/Search";
import Settings from "./pages/Settings";

import Loader from "./components/Loader";

function Unauthorized() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>403</h1>
      <p>Unauthorized Access</p>
    </div>
  );
}

function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>404</h1>
      <p>Page Not Found</p>
    </div>
  );
}

function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin" replace />;

    case "lecturer":
      return <Navigate to="/lecturer" replace />;

    default:
      return <Navigate to="/student" replace />;
  }
}

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<HomeRedirect />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>

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

          <Route path="/feed" element={<Feed />} />

          <Route path="/messages" element={<Messages />} />

          <Route path="/communities" element={<Communities />} />

          <Route path="/chat/:id" element={<ChatRoom />} />

          <Route path="/events" element={<Events />} />

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          <Route path="/profile" element={<Profile />} />

          <Route
            path="/profile/edit"
            element={<EditProfile />}
          />

          <Route path="/search" element={<Search />} />

          <Route path="/settings" element={<Settings />} />

        </Route>

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />

        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}

import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleGuard from "./RoleGuard";

/* ---------- AUTH ---------- */

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* ---------- LAYOUT ---------- */

import MainLayout from "../layouts/MainLayout";

/* ---------- STUDENT ---------- */

import StudentDashboard from "../pages/student/Dashboard";

/* ---------- LECTURER ---------- */

import LecturerDashboard from "../pages/lecturer/Dashboard";

/* ---------- ADMIN ---------- */

import AdminDashboard from "../pages/admin/Dashboard";

/* ---------- COMMON ---------- */

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

          {/* Student */}

          <Route
            path="/student"
            element={
              <RoleGuard roles={["student"]}>
                <StudentDashboard />
              </RoleGuard>
            }
          />

          {/* Lecturer */}

          <Route
            path="/lecturer"
            element={
              <RoleGuard roles={["lecturer"]}>
                <LecturerDashboard />
              </RoleGuard>
            }
          />

          {/* Admin */}

          <Route
            path="/admin"
            element={
              <RoleGuard roles={["admin"]}>
                <AdminDashboard />
              </RoleGuard>
            }
          />

        </Route>

      </Route>

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

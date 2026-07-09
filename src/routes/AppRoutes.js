import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleGuard from "./RoleGuard";

/* Auth pages */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* Student pages */
import StudentDashboard from "../pages/Student/Dashboard";
import Courses from "../pages/Student/Courses";
import Assignments from "../pages/Student/Assignments";
import Exams from "../pages/Student/Exams";
import TakeExam from "../pages/Student/TakeExam";
import Results from "../pages/Student/Results";

/* Lecturer pages */
import LecturerDashboard from "../pages/Lecturer/Dashboard";
import ExamList from "../pages/Lecturer/ExamList";
import UploadNotes from "../pages/Lecturer/UploadNotes";
import CreateExam from "../pages/Lecturer/CreateExam";
import GradeSubmissions from "../pages/Lecturer/GradeSubmissions";
import ViewSubmission from "../pages/Lecturer/ViewSubmission";

/* Admin pages */
import Dashboard from "../pages/Admin/Dashboard";
import ManageUsers from "../pages/Admin/Users";

/* Error pages */
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ===== Public routes ===== */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ===== Protected routes ===== */}
      <Route element={<ProtectedRoute />}>
        {/* Student */}
        <Route
          path="/student/dashboard"
          element={
            <RoleGuard roles={["student"]}>
              <StudentDashboard />
            </RoleGuard>
          }
        />
        <Route
          path="/student/courses"
          element={
            <RoleGuard roles={["student"]}>
              <Courses />
            </RoleGuard>
          }
        />
        <Route
          path="/student/assignments"
          element={
            <RoleGuard roles={["student"]}>
              <Assignments />
            </RoleGuard>
          }
        />
        <Route
          path="/student/exams"
          element={
            <RoleGuard roles={["student"]}>
              <Exams />
            </RoleGuard>
          }
        />
        <Route
          path="/student/exams/:examId"
          element={
            <RoleGuard roles={["student"]}>
              <TakeExam />
            </RoleGuard>
          }
        />
        <Route
          path="/student/results"
          element={
            <RoleGuard roles={["student"]}>
              <Results />
            </RoleGuard>
          }
        />

        {/* Lecturer */}
        <Route
          path="/lecturer/dashboard"
          element={
            <RoleGuard roles={["lecturer"]}>
              <LecturerDashboard />
            </RoleGuard>
          }
        />
        <Route
          path="/lecturer/exams"
          element={
            <RoleGuard roles={["lecturer", "admin"]}>
              <ExamList />
            </RoleGuard>
          }
        />
        <Route
          path="/lecturer/exams/create"
          element={
            <RoleGuard roles={["lecturer", "admin"]}>
              <CreateExam />
            </RoleGuard>
          }
        />
        <Route
          path="/lecturer/upload-notes"
          element={
            <RoleGuard roles={["lecturer"]}>
              <UploadNotes />
            </RoleGuard>
          }
        />
        <Route
          path="/lecturer/submissions"
          element={
            <RoleGuard roles={["lecturer", "admin"]}>
              <GradeSubmissions />
            </RoleGuard>
          }
        />
        <Route
          path="/lecturer/submissions/:submissionId"
          element={
            <RoleGuard roles={["lecturer", "admin"]}>
              <ViewSubmission />
            </RoleGuard>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleGuard roles={["admin"]}>
              <Dashboard />
            </RoleGuard>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleGuard roles={["admin"]}>
              <ManageUsers />
            </RoleGuard>
          }
        />
      </Route>

      {/* ===== Misc ===== */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

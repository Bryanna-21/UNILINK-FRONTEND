import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleGuard from "./RoleGuard";
import MainLayout from "../layouts/MainLayout";

/* Auth pages */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";
import VerifyLoginOtp from "../pages/auth/VerifyLoginOtp";
import ForgotPassword from "../pages/auth/ForgotPassword";

/* Student pages */
import StudentDashboard from "../pages/Student/Dashboard";
import Courses from "../pages/Student/Courses";
import Assignments from "../pages/Student/Assignments";
import Exams from "../pages/Student/Exams";
import TakeExam from "../pages/Student/TakeExam";
import Results from "../pages/Student/Results";
import Timetable from "../pages/Student/Timetable";
import Notes from "../pages/Student/Notes";
import Attendance from "../pages/Student/Attendance";
import Units from "../pages/Student/Units";

/* Lecturer pages */
import LecturerDashboard from "../pages/Lecturer/Dashboard";
import LecturerCourses from "../pages/Lecturer/Courses";
import ExamList from "../pages/Lecturer/ExamList";
import UploadNotes from "../pages/Lecturer/UploadNotes";
import CreateExam from "../pages/Lecturer/CreateExam";
import GradeSubmissions from "../pages/Lecturer/GradeSubmissions";
import ViewSubmission from "../pages/Lecturer/ViewSubmission";
import Analytics from "../pages/Lecturer/Analytics";
import Announcements from "../pages/Lecturer/Announcements";

/* Admin pages */
import Dashboard from "../pages/Admin/Dashboard";
import ManageUsers from "../pages/Admin/Users";

/* Shared pages (any authenticated role) */
import Feed from "../pages/Feed";
import Communities from "../pages/Communities";
import CreateCommunity from "../pages/CreateCommunity";
import Events from "../pages/Events";
import CreateEvent from "../pages/CreateEvent";
import Messages from "../pages/Messages";
import ChatRoom from "../pages/ChatRoom";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import Search from "../pages/Search";
import Marketplace from "../pages/Marketplace";
import LostAndFound from "../pages/LostAndFound";
import Library from "../pages/Library";
import StudyGroups from "../pages/StudyGroups";
import Polls from "../pages/Polls";
import Clubs from "../pages/Clubs";
import Settings from "../pages/Settings";

/* Error pages */
import Unauthorized from "../pages/Errors/Unauthorized";
import NotFound from "../pages/Errors/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ===== Public routes ===== */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Not gated by PublicRoute's isAuthenticated check in the
            usual sense - a user here has no token yet either way -
            but they belong in the public group since ProtectedRoute
            would bounce them for lacking auth entirely. */}
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/verify-login-otp" element={<VerifyLoginOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* ===== Protected routes (wrapped in MainLayout for sidebar/topbar) ===== */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
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
          <Route
            path="/student/timetable"
            element={
              <RoleGuard roles={["student"]}>
                <Timetable />
              </RoleGuard>
            }
          />
          <Route
            path="/student/notes"
            element={
              <RoleGuard roles={["student"]}>
                <Notes />
              </RoleGuard>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <RoleGuard roles={["student"]}>
                <Attendance />
              </RoleGuard>
            }
          />
          <Route
            path="/student/units"
            element={
              <RoleGuard roles={["student"]}>
                <Units />
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
            path="/lecturer/courses"
            element={
              <RoleGuard roles={["lecturer"]}>
                <LecturerCourses />
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
          <Route
            path="/lecturer/analytics"
            element={
              <RoleGuard roles={["lecturer"]}>
                <Analytics />
              </RoleGuard>
            }
          />
          <Route
            path="/lecturer/announcements"
            element={
              <RoleGuard roles={["lecturer"]}>
                <Announcements />
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

          {/* Shared — any authenticated role */}
          <Route path="/feed" element={<Feed />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/communities/create" element={<CreateCommunity />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/chat/:roomId" element={<ChatRoom />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/lost-and-found" element={<LostAndFound />} />
          <Route path="/library" element={<Library />} />
          <Route path="/study-groups" element={<StudyGroups />} />
          <Route path="/polls" element={<Polls />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      {/* ===== Misc ===== */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

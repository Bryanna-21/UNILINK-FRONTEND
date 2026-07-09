// NOTE: These exam routes are already wired into AppRoutes.js and mounted
// there under ProtectedRoute + RoleGuard. This file is kept only as a
// standalone reference and is not imported anywhere in the app.

import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";

/* Student pages */
import Exams from "../pages/Student/Exams";
import TakeExam from "../pages/Student/TakeExam";
import Results from "../pages/Student/Results";

/* Lecturer pages */
import CreateExam from "../pages/Lecturer/CreateExam";
import ExamList from "../pages/Lecturer/ExamList";
import GradeSubmissions from "../pages/Lecturer/GradeSubmissions";
import ViewSubmission from "../pages/Lecturer/ViewSubmission";

const ExamRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
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
      </Route>

      <Route path="*" element={<Navigate to="/student/exams" replace />} />
    </Routes>
  );
};

export default ExamRoutes;

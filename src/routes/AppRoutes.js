import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";


import ProtectedRoute from "./ProtectedRoute";


// Authentication pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";


// Student pages
import StudentDashboard from "../pages/Student/Dashboard";
import Exams from "../pages/Student/Exams";
import Results from "../pages/Student/Results";
import TakeExam from "../pages/Student/TakeExam";

import StudentCourses from "../pages/Student/Courses";
import StudentUnits from "../pages/Student/Units";
import StudentNotes from "../pages/Student/Notes";
import StudentAssignments from "../pages/Student/Assignments";
import StudentTimetable from "../pages/Student/Timetable";
import StudentAttendance from "../pages/Student/Attendance";


// Lecturer pages
import LecturerDashboard from "../pages/Lecturer/Dashboard";

import CreateExam from "../pages/Lecturer/CreateExam";
import ExamList from "../pages/Lecturer/ExamList";
import GradeSubmissions from "../pages/Lecturer/GradeSubmissions";
import ViewSubmission from "../pages/Lecturer/ViewSubmission";

import LecturerCourses from "../pages/Lecturer/Courses";
import UploadNotes from "../pages/Lecturer/UploadNotes";
import CreateAssignment from "../pages/Lecturer/CreateAssignment";
import Announcements from "../pages/Lecturer/Announcements";
import LecturerAnalytics from "../pages/Lecturer/Analytics";


// Admin pages
import AdminDashboard from "../pages/Admin/dashboard";



const AppRoutes = () => {


  return (

    <Router>


      <Routes>


        {/* Public Routes */}

        <Route

          path="/login"

          element={<Login />}

        />


        <Route

          path="/register"

          element={<Register />}

        />





        {/* Student Routes */}

        <Route

          path="/student/dashboard"

          element={

            <ProtectedRoute role="student">

              <StudentDashboard />

            </ProtectedRoute>

          }

        />



        <Route

          path="/student/exams"

          element={

            <ProtectedRoute role="student">

              <Exams />

            </ProtectedRoute>

          }

        />



        <Route

          path="/student/results"

          element={

            <ProtectedRoute role="student">

              <Results />

            </ProtectedRoute>

          }

        />



        <Route

          path="/student/exams/:id"

          element={

            <ProtectedRoute role="student">

              <TakeExam />

            </ProtectedRoute>

          }

        />




        {/* Academic Student Routes */}


        <Route

          path="/student/courses"

          element={

            <ProtectedRoute role="student">

              <StudentCourses />

            </ProtectedRoute>

          }

        />



        <Route

          path="/student/units"

          element={

            <ProtectedRoute role="student">

              <StudentUnits />

            </ProtectedRoute>

          }

        />



        <Route

          path="/student/notes"

          element={

            <ProtectedRoute role="student">

              <StudentNotes />

            </ProtectedRoute>

          }

        />



        <Route

          path="/student/assignments"

          element={

            <ProtectedRoute role="student">

              <StudentAssignments />

            </ProtectedRoute>

          }

        />



        <Route

          path="/student/timetable"

          element={

            <ProtectedRoute role="student">

              <StudentTimetable />

            </ProtectedRoute>

          }

        />



        <Route

          path="/student/attendance"

          element={

            <ProtectedRoute role="student">

              <StudentAttendance />

            </ProtectedRoute>

          }

        />








        {/* Lecturer Routes */}


        <Route

          path="/lecturer/dashboard"

          element={

            <ProtectedRoute role="lecturer">

              <LecturerDashboard />

            </ProtectedRoute>

          }

        />



        <Route

          path="/lecturer/courses"

          element={

            <ProtectedRoute role="lecturer">

              <LecturerCourses />

            </ProtectedRoute>

          }

        />



        <Route

          path="/lecturer/upload-notes"

          element={

            <ProtectedRoute role="lecturer">

              <UploadNotes />

            </ProtectedRoute>

          }

        />



        <Route

          path="/lecturer/create-assignment"

          element={

            <ProtectedRoute role="lecturer">

              <CreateAssignment />

            </ProtectedRoute>

          }

        />



        <Route

          path="/lecturer/announcements"

          element={

            <ProtectedRoute role="lecturer">

              <Announcements />

            </ProtectedRoute>

          }

        />



        <Route

          path="/lecturer/analytics"

          element={

            <ProtectedRoute role="lecturer">

              <LecturerAnalytics />

            </ProtectedRoute>

          }

        />





        {/* Existing Exam Lecturer Routes */}


        <Route

          path="/lecturer/exams/create"

          element={

            <ProtectedRoute role="lecturer">

              <CreateExam />

            </ProtectedRoute>

          }

        />



        <Route

          path="/lecturer/exams"

          element={

            <ProtectedRoute role="lecturer">

              <ExamList />

            </ProtectedRoute>

          }

        />



        <Route

          path="/lecturer/submissions"

          element={

            <ProtectedRoute role="lecturer">

              <GradeSubmissions />

            </ProtectedRoute>

          }

        />



        <Route

          path="/lecturer/submissions/:id"

          element={

            <ProtectedRoute role="lecturer">

              <ViewSubmission />

            </ProtectedRoute>

          }

        />







        {/* Admin Routes */}


        <Route

          path="/admin/dashboard"

          element={

            <ProtectedRoute role="admin">

              <AdminDashboard />

            </ProtectedRoute>

          }

        />




        {/* Fallback */}


        <Route

          path="*"

          element={<Login />}

        />


      </Routes>


    </Router>

  );

};


export default AppRoutes;

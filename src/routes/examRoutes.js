import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* ===========================================
   STUDENT PAGES
=========================================== */

import Exams from "../pages/Student/Exams";
import TakeExam from "../pages/Student/TakeExam";
import Results from "../pages/Student/Results";

/* ===========================================
   LECTURER PAGES
=========================================== */

import CreateExam from "../pages/Lecturer/CreateExam";
import ExamList from "../pages/Lecturer/ExamList";
import GradeSubmissions from "../pages/Lecturer/GradeSubmissions";
import ViewSubmission from "../pages/Lecturer/ViewSubmission";

/* ===========================================
   AUTH COMPONENTS
=========================================== */

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

/*
Expected structure:

ProtectedRoute
    └── checks if user is logged in

RoleRoute
    └── checks user role

Allowed Roles

Student
Lecturer
Admin
*/

/* ===========================================
   EXAM ROUTES
=========================================== */

const ExamRoutes = () => {

    return (

        <Routes>

            {/* ===========================
                STUDENT ROUTES
            =========================== */}

            <Route
                element={<ProtectedRoute />}
            >

                <Route
                    element={
                        <RoleRoute
                            allowedRoles={["Student"]}
                        />
                    }
                >

                    <Route
                        path="/student/exams"
                        element={<Exams />}
                    />

                    <Route
                        path="/student/exams/:examId"
                        element={<TakeExam />}
                    />

                    <Route
                        path="/student/results"
                        element={<Results />}
                    />

                </Route>

            </Route>

            {/* ===========================
                LECTURER ROUTES
            =========================== */}

            <Route
                element={<ProtectedRoute />}
            >

                <Route
                    element={
                        <RoleRoute
                            allowedRoles={[
                                "Lecturer",
                                "Admin",
                            ]}
                        />
                    }
                >

                    <Route
                        path="/lecturer/exams"
                        element={<ExamList />}
                    />

                    <Route
                        path="/lecturer/exams/create"
                        element={<CreateExam />}
                    />

                    <Route
                        path="/lecturer/submissions"
                        element={<GradeSubmissions />}
                    />

                    <Route
                        path="/lecturer/submissions/:submissionId"
                        element={<ViewSubmission />}
                    />

                </Route>

            </Route>

            {/* ===========================
                DEFAULT REDIRECT
            =========================== */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/student/exams"
                        replace
                    />
                }
            />

        </Routes>

    );

};

export default ExamRoutes;

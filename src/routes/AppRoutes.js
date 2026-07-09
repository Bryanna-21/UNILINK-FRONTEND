<Route
    path="/login"
    element={
        <PublicRoute>
            <Login />
        </PublicRoute>
    }
/>

<Route
    path="/register"
    element={
        <PublicRoute>
            <Register />
        </PublicRoute>
    }
/>
<Route
    path="/student/dashboard"
    element={
        <ProtectedRoute>
            <RoleGuard roles={["student"]}>
                <StudentDashboard />
            </RoleGuard>
        </ProtectedRoute>
    }
/>

<Route
    path="/student/courses"
    element={
        <ProtectedRoute>
            <RoleGuard roles={["student"]}>
                <Courses />
            </RoleGuard>
        </ProtectedRoute>
    }
/>

<Route
    path="/student/assignments"
    element={
        <ProtectedRoute>
            <RoleGuard roles={["student"]}>
                <Assignments />
            </RoleGuard>
        </ProtectedRoute>
    }
/>
<Route
    path="/lecturer/dashboard"
    element={
        <ProtectedRoute>
            <RoleGuard roles={["lecturer"]}>
                <LecturerDashboard />
            </RoleGuard>
        </ProtectedRoute>
    }
/>

<Route
    path="/lecturer/exams"
    element={
        <ProtectedRoute>
            <RoleGuard roles={["lecturer"]}>
                <ExamList />
            </RoleGuard>
        </ProtectedRoute>
    }
/>

<Route
    path="/lecturer/upload-notes"
    element={
        <ProtectedRoute>
            <RoleGuard roles={["lecturer"]}>
                <UploadNotes />
            </RoleGuard>
        </ProtectedRoute>
    }
/>
<Route
    path="/admin/dashboard"
    element={
        <ProtectedRoute>
            <RoleGuard roles={["admin"]}>
                <Dashboard />
            </RoleGuard>
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/users"
    element={
        <ProtectedRoute>
            <RoleGuard roles={["admin"]}>
                <ManageUsers />
            </RoleGuard>
        </ProtectedRoute>
    }
/>
<Route path="/unauthorized" element={<Unauthorized />} />

<Route path="*" element={<NotFound />} />

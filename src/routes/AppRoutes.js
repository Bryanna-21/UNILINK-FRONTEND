import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";
import VerifyLoginOtp from "../pages/auth/VerifyLoginOtp";
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
import Settings from "../pages/Settings";
import AI from "../pages/AI";
import Unauthorized from "../pages/Errors/Unauthorized";
import NotFound from "../pages/Errors/NotFound";

const studentOnly = (element) => element;
export default function AppRoutes() {
  return <Routes>
    <Route element={<PublicRoute />}><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/verify-otp" element={<VerifyOtp/>}/><Route path="/verify-login-otp" element={<VerifyLoginOtp/>}/></Route>
    <Route element={<ProtectedRoute />}><Route element={<MainLayout/>}>
      <Route path="/student/dashboard" element={studentOnly(<StudentDashboard/>)}/><Route path="/student/courses" element={studentOnly(<Courses/>)}/><Route path="/student/assignments" element={studentOnly(<Assignments/>)}/><Route path="/student/exams" element={studentOnly(<Exams/>)}/><Route path="/student/exams/:examId" element={studentOnly(<TakeExam/>)}/><Route path="/student/results" element={studentOnly(<Results/>)}/><Route path="/student/timetable" element={studentOnly(<Timetable/>)}/><Route path="/student/notes" element={studentOnly(<Notes/>)}/><Route path="/student/attendance" element={studentOnly(<Attendance/>)}/><Route path="/student/units" element={studentOnly(<Units/>)}/><Route path="/feed" element={<Feed/>}/><Route path="/communities" element={<Communities/>}/><Route path="/communities/create" element={<CreateCommunity/>}/><Route path="/events" element={<Events/>}/><Route path="/events/create" element={<CreateEvent/>}/><Route path="/messages" element={<Messages/>}/><Route path="/chat/:roomId" element={<ChatRoom/>}/><Route path="/notifications" element={<Notifications/>}/><Route path="/profile" element={<Profile/>}/><Route path="/profile/edit" element={<EditProfile/>}/><Route path="/search" element={<Search/>}/><Route path="/settings" element={<Settings/>}/><Route path="/ai" element={<AI/>}/><Route path="/unauthorized" element={<Unauthorized/>}/><Route path="*" element={<NotFound/>}/>
    </Route></Route>
    <Route path="/" element={<Navigate to="/login" replace/>}/><Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}

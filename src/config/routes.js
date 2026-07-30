const ROUTES = {

  HOME: "/",

  LOGIN: "/login",

  REGISTER: "/register",

  FEED: "/feed",

  PROFILE: "/profile",

  EDIT_PROFILE: "/profile/edit",

  SEARCH: "/search",

  EVENTS: "/events",

  CREATE_EVENT: "/events/create",

  COMMUNITIES: "/communities",

  CREATE_COMMUNITY: "/communities/create",

  MESSAGES: "/messages",

  CHATROOM: "/chat/:roomId",

  NOTIFICATIONS: "/notifications",

  SETTINGS: "/settings",

  STUDENT_DASHBOARD: "/student/dashboard",

  STUDENT_COURSES: "/student/courses",

  STUDENT_ASSIGNMENTS: "/student/assignments",

  STUDENT_EXAMS: "/student/exams",

  STUDENT_TAKE_EXAM: "/student/exams/:examId",

  STUDENT_RESULTS: "/student/results",

  STUDENT_TIMETABLE: "/student/timetable",

  STUDENT_NOTES: "/student/notes",

  STUDENT_ATTENDANCE: "/student/attendance",

  STUDENT_UNITS: "/student/units",

  LECTURER_DASHBOARD: "/lecturer/dashboard",

  LECTURER_COURSES: "/lecturer/courses",

  LECTURER_EXAMS: "/lecturer/exams",

  LECTURER_CREATE_EXAM: "/lecturer/exams/create",

  LECTURER_UPLOAD_NOTES: "/lecturer/upload-notes",

  LECTURER_SUBMISSIONS: "/lecturer/submissions",

  LECTURER_VIEW_SUBMISSION: "/lecturer/submissions/:submissionId",

  LECTURER_ANALYTICS: "/lecturer/analytics",

  LECTURER_ANNOUNCEMENTS: "/lecturer/announcements",

  ADMIN_DASHBOARD: "/admin/dashboard",

  ADMIN_USERS: "/admin/users",

  UNAUTHORIZED: "/unauthorized",

  NOT_FOUND: "*"

};

export default ROUTES;

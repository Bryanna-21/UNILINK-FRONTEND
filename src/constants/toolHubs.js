// What each tools hub shows. One list per role, kept apart from the page so a test can check that
// every card points at a page that exists and that the role is allowed to open.

export const LECTURER_TOOL_GROUPS = [
  {
    title: "Teaching",
    cards: [
      ["My Courses", "The courses you teach", "/lecturer/courses"],
      ["Upload Notes", "Share notes with your students", "/lecturer/upload-notes"],
      ["Announcements", "Post to your students", "/lecturer/announcements"],
    ],
  },
  {
    title: "Assessment",
    cards: [
      ["Exams", "Create and manage exams", "/lecturer/exams"],
      ["Submissions", "Grade what students handed in", "/lecturer/submissions"],
    ],
  },
  {
    title: "Insight and safety",
    cards: [
      ["Analytics", "How your courses are doing", "/lecturer/analytics"],
      ["Emergency Reports", "Reports you are able to see", "/lecturer/emergency-reports"],
      ["AI Assistant", "Ask UniLink AI for help", "/ai-assistant"],
    ],
  },
];

export const ADMIN_TOOL_GROUPS = [
  {
    title: "People",
    cards: [
      ["Users", "Browse every user in your university", "/admin/users"],
      ["Make Lecturer or Admin", "Change a user's role", "/admin/roles"],
    ],
  },
  {
    title: "Safety",
    cards: [
      ["Emergency Reports", "Review, respond to and resolve reports", "/lecturer/emergency-reports"],
      ["Notifications", "Alerts for administrators", "/notifications"],
    ],
  },
  {
    title: "Academics",
    cards: [
      ["Exams", "View exams across courses", "/lecturer/exams"],
      ["Submissions", "View graded and pending submissions", "/lecturer/submissions"],
    ],
  },
];

import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CourseDetail from "../CourseDetail";
import courseService from "../../../services/courseService";
import pastPaperService from "../../../services/pastPaperService";

jest.mock("../../../services/courseService", () => ({ __esModule: true, default: { getCourseById: jest.fn() } }));
jest.mock("../../../services/pastPaperService", () => ({ __esModule: true, default: { getPastPapers: jest.fn() } }));
jest.mock("../../../services/discussionService", () => ({ __esModule: true, default: { getDiscussionForCourse: jest.fn().mockResolvedValue({ data: [] }), postDiscussion: jest.fn() } }));
jest.mock("../../../services/unitService", () => ({ __esModule: true, default: { getUnitsForCourse: jest.fn().mockResolvedValue({ data: [] }) } }));
jest.mock("../../../services/noteService", () => ({ __esModule: true, default: { getNotesForCourse: jest.fn().mockResolvedValue({ data: [] }) } }));
jest.mock("../../../services/catService", () => ({ __esModule: true, default: { getCatsForCourse: jest.fn().mockResolvedValue({ data: [] }), getMyResultForCat: jest.fn() } }));
jest.mock("../../../services/assignmentService", () => ({ __esModule: true, default: { getAssignmentsForCourse: jest.fn().mockResolvedValue({ data: [] }) } }));
jest.mock("../../../services/messageService", () => ({ __esModule: true, default: { getCourseConversation: jest.fn().mockResolvedValue({ data: null }) } }));
jest.mock("../../../context/AuthContext", () => ({ useAuth: () => ({ user: { id: "u1", role: "student" } }) }));
global.IS_REACT_ACT_ENVIRONMENT = true;

let container;
let root;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  courseService.getCourseById.mockResolvedValue({ data: { _id: "c1", title: "Data Structures", code: "CS201", description: "", studentIds: ["u1"] } });
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});
const mount = () => act(async () => { root.render(<MemoryRouter initialEntries={["/student/courses/c1"]}><Routes><Route path="/student/courses/:courseId" element={<CourseDetail />} /></Routes></MemoryRouter>); });
const openPapers = async () => { await act(async () => { [...container.querySelectorAll(".course-tab")].find((b) => b.textContent.includes("Past Papers")).click(); }); };

test("the course page has a Past Papers tab that lists papers with links to the paper and the marking scheme", async () => {
  pastPaperService.getPastPapers.mockResolvedValue({ data: [
    { _id: "p1", title: "End of semester exam", year: 2024, fileUrl: "https://files.example/p1.pdf", markingSchemeUrl: "https://files.example/p1-ms.pdf" },
    { _id: "p2", title: "Resit", fileUrl: "https://files.example/p2.pdf" },
  ] });
  await mount();
  await openPapers();
  expect(pastPaperService.getPastPapers).toHaveBeenCalledWith("c1");
  const entries = container.querySelectorAll(".course-notes-list .note-entry");
  expect(entries.length).toBe(2);
  expect(entries[0].textContent).toContain("End of semester exam (2024)");
  const links = [...entries[0].querySelectorAll("a")].map((a) => a.getAttribute("href"));
  expect(links).toEqual(["https://files.example/p1.pdf", "https://files.example/p1-ms.pdf"]);
  expect(entries[1].querySelectorAll("a").length).toBe(1);
  expect(entries[1].querySelector("a").getAttribute("rel")).toContain("noopener");
});

test("a link that is not http(s) (for example javascript:) is never made clickable", async () => {
  pastPaperService.getPastPapers.mockResolvedValue({ data: [{ _id: "p1", title: "Bad", fileUrl: "javascript:alert(1)", markingSchemeUrl: "data:text/html,x" }] });
  await mount();
  await openPapers();
  expect(container.querySelectorAll(".course-notes-list a").length).toBe(0);
});

test("a course with no past papers says so", async () => {
  pastPaperService.getPastPapers.mockResolvedValue({ data: [] });
  await mount();
  await openPapers();
  expect(container.textContent).toContain("No past papers have been added for this course yet.");
});

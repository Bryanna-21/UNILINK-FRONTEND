// ==============================================
// UniLink Exam Service
// Handles all Exam API Requests
// ==============================================

import api from "./api";

/**
 * Create Exam
 */
export const createExam = async (examData) => {
  const { data } = await api.post("/exams", examData);
  return data;
};

/**
 * Update Exam
 */
export const updateExam = async (examId, examData) => {
  const { data } = await api.put(`/exams/${examId}`, examData);
  return data;
};

/**
 * Delete Exam
 */
export const deleteExam = async (examId) => {
  const { data } = await api.delete(`/exams/${examId}`);
  return data;
};

/**
 * Publish Exam
 */
export const publishExam = async (examId) => {
  const { data } = await api.patch(`/exams/${examId}/publish`);
  return data;
};

/**
 * Close Exam
 */
export const closeExam = async (examId) => {
  const { data } = await api.patch(`/exams/${examId}/close`);
  return data;
};

/**
 * Get All Exams
 */
export const getAllExams = async () => {
  const { data } = await api.get("/exams");
  return data;
};

/**
 * Get Student Exams
 */
export const getStudentExams = async () => {
  const { data } = await api.get("/exams");
  return data;
};

/**
 * Get Lecturer Exams
 */
export const getLecturerExams = async () => {
  const { data } = await api.get("/exams/lecturer");
  return data;
};

/**
 * Get Single Exam
 */
export const getExamById = async (examId) => {
  const { data } = await api.get(`/exams/${examId}`);
  return data;
};

/**
 * Submit Exam
 */
export const submitExam = async (examId, answers) => {
  const { data } = await api.post(
    `/exams/${examId}/submit`,
    {
      answers,
    }
  );

  return data;
};

/**
 * Get Submissions
 *
 * No examId param: GradeSubmissions.js calls this with no argument,
 * expecting every submission across all of this lecturer's exams in
 * one flat list, so that's what the route (and its backend handler)
 * actually returns. Previously requested /exams/${examId}/submissions,
 * a route that both never existed on the backend and never matched
 * how this function is actually called from any page.
 */
export const getExamSubmissions = async () => {
  const { data } = await api.get(`/exams/submissions`);
  return data.data;
};

/**
 * Get Single Submission
 *
 * .data.data, not .data: the backend wraps its response as
 * {status, data: {...submission}}, but ViewSubmission.js reads the
 * result as the submission object directly (data.answers, data.student,
 * etc.) with no wrapper - unwrapping here, once, keeps that page
 * correct without changing how it reads the response.
 */
export const getExamSubmission = async (submissionId) => {
  const { data } = await api.get(`/exams/submissions/${submissionId}`);
  return data.data;
};

/**
 * Grade Submission
 *
 * Second argument is one object ({marks, feedback, total}), matching
 * how ViewSubmission.js actually calls this - the previous three-
 * argument (submissionId, marks, feedback) signature silently
 * received the whole object as `marks` and undefined as `feedback`
 * every time this was called. `total` is accepted here for shape
 * compatibility with the caller but not sent - the backend computes
 * score itself from `marks` as the source of truth, since trusting a
 * client-computed total would let a stale/tampered value overwrite a
 * correctly-summed one.
 */
export const gradeSubmission = async (
  submissionId,
  { marks, feedback }
) => {
  const { data } = await api.post(
    `/exams/submissions/${submissionId}/grade`,
    {
      marks,
      feedback,
    }
  );

  return data.data;
};

/**
 * Student Results
 */
export const getStudentResults = async () => {
  const { data } = await api.get("/exams/results/me");
  return data;
};

/**
 * Single Result
 *
 * Not called from anywhere currently (confirmed: no page imports
 * getResult) and there is no standalone GET /results/:id route on
 * the backend - ExamResult is only ever read as part of a submission
 * (see getExamSubmission above) or the student's own results list.
 * Left pointing at a route that doesn't exist since nothing exercises
 * this path; fix properly if something starts calling it.
 */
export const getResult = async (resultId) => {
  const { data } = await api.get(`/results/${resultId}`);
  return data;
};

/**
 * Analytics
 */
export const getExamAnalytics = async (examId) => {
  const { data } = await api.get(
    `/exams/${examId}/analytics`
  );

  return data;
};

/**
 * Upload Attachment
 */
export const uploadExamAttachment = async (formData) => {
  const { data } = await api.post(
    "/uploads/exams",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

/**
 * Duplicate Exam
 */
export const duplicateExam = async (examId) => {
  const { data } = await api.post(
    `/exams/${examId}/duplicate`
  );

  return data;
};

/**
 * Archive Exam
 */
export const archiveExam = async (examId) => {
  const { data } = await api.patch(
    `/exams/${examId}/archive`
  );

  return data;
};

/**
 * Restore Archived Exam
 */
export const restoreExam = async (examId) => {
  const { data } = await api.patch(
    `/exams/${examId}/restore`
  );

  return data;
};

/**
 * Export Results
 */
export const exportResults = async (examId) => {
  const response = await api.get(
    `/exams/${examId}/export`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};

const examService = {
  createExam,
  updateExam,
  deleteExam,
  publishExam,
  closeExam,
  getAllExams,
  getStudentExams,
  getLecturerExams,
  getExamById,
  submitExam,
  getExamSubmissions,
  getExamSubmission,
  gradeSubmission,
  getStudentResults,
  getResult,
  getExamAnalytics,
  uploadExamAttachment,
  duplicateExam,
  archiveExam,
  restoreExam,
  exportResults,
};

export default examService;

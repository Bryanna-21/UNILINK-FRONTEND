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
  const { data } = await api.get("/exams/student");
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
 */
export const getExamSubmissions = async (examId) => {
  const { data } = await api.get(`/exams/${examId}/submissions`);
  return data;
};

/**
 * Grade Submission
 */
export const gradeSubmission = async (
  submissionId,
  marks,
  feedback
) => {
  const { data } = await api.put(
    `/submissions/${submissionId}/grade`,
    {
      marks,
      feedback,
    }
  );

  return data;
};

/**
 * Student Results
 */
export const getStudentResults = async () => {
  const { data } = await api.get("/results/me");
  return data;
};

/**
 * Single Result
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

export default {
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

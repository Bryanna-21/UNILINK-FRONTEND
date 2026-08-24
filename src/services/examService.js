import api from "./api";

const examService = {
  async getStudentExams() {
    const { data } = await api.get("/exams/student");
    return data?.data || data?.exams || data || [];
  },

  async getStudentResults() {
    const { data } = await api.get("/exams/student/results");
    return data?.data || data?.results || data || [];
  },

  async getExamById(id) {
    const { data } = await api.get(`/exams/${id}`);
    return data?.data || data;
  },

  async submitExam(id, payload) {
    const { data } = await api.post(`/exams/${id}/submit`, payload);
    return data;
  },
};

export default examService;

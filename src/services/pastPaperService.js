import api from "./api";

/**
 * Past papers for a course: GET /courses/:id/past-papers (any signed-in person). Each paper has a title, a year,
 * a file link and sometimes a marking scheme link. The same endpoint the app uses.
 */
const pastPaperService = {
  getPastPapers: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/past-papers`);
    return response.data;
  },
};

export default pastPaperService;

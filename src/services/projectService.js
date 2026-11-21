import api from "./api";

/**
 * Projects: GET and POST /community/projects, the same endpoints the app uses. There is no join or leave route for
 * projects on the server (contributors are set by the server), so the page offers none.
 */
const projectService = {
  getProjects: async () => {
    const response = await api.get("/community/projects");
    return response.data;
  },
  createProject: async ({ title, description, status }) => {
    const response = await api.post("/community/projects", { title, description: description || undefined, status });
    return response.data;
  },
};

export default projectService;

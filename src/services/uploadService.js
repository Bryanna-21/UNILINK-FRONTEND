import api from "./api";

const uploadService = {
  // ==========================================
  // Generic Upload
  // ==========================================

  async uploadFile(formData) {
    const response = await api.post(
      "/uploads/file",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // ==========================================
  // Profile
  // ==========================================

  async uploadProfilePhoto(formData) {
    const response = await api.post(
      "/uploads/profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  async uploadCoverPhoto(formData) {
    const response = await api.post(
      "/uploads/cover",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // ==========================================
  // Posts
  // ==========================================

  async uploadPostImage(formData) {
    const response = await api.post(
      "/uploads/posts/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  async uploadPostVideo(formData) {
    const response = await api.post(
      "/uploads/posts/video",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // ==========================================
  // Messaging
  // ==========================================

  async uploadMessageMedia(formData) {
    const response = await api.post(
      "/uploads/messages",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // ==========================================
  // Communities
  // ==========================================

  async uploadCommunityBanner(formData) {
    const response = await api.post(
      "/uploads/communities/banner",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // ==========================================
  // Events
  // ==========================================

  async uploadEventBanner(formData) {
    const response = await api.post(
      "/uploads/events/banner",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // ==========================================
  // Academic
  // ==========================================

  async uploadNotes(formData) {
    const response = await api.post(
      "/uploads/notes",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  async uploadAssignment(formData) {
    const response = await api.post(
      "/uploads/assignments",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  async uploadPastPaper(formData) {
    const response = await api.post(
      "/uploads/past-papers",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // ==========================================
  // Emergency
  // ==========================================

  async uploadEmergencyEvidence(formData) {
    const response = await api.post(
      "/uploads/emergency",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // ==========================================
  // Admin
  // ==========================================

  async uploadUniversityLogo(formData) {
    const response = await api.post(
      "/uploads/university/logo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  async uploadUniversityBanner(formData) {
    const response = await api.post(
      "/uploads/university/banner",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // ==========================================
  // Delete
  // ==========================================

  async deleteFile(fileId) {
    const response = await api.delete(
      `/uploads/${fileId}`
    );

    return response.data;
  },
};

export default uploadService;

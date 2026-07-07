import api from "./api";

const postService = {
  // ==========================================
  // Feed
  // ==========================================

  async getFeed(page = 1, limit = 20) {
    const response = await api.get("/posts", {
      params: {
        page,
        limit,
      },
    });

    return response.data;
  },

  async getTrendingPosts() {
    const response = await api.get("/posts/trending");
    return response.data;
  },

  async getSavedPosts() {
    const response = await api.get("/posts/saved");
    return response.data;
  },

  async getUserPosts(userId) {
    const response = await api.get(`/posts/user/${userId}`);
    return response.data;
  },

  async getPost(postId) {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  // ==========================================
  // Create
  // ==========================================

  async createPost(postData) {
    const response = await api.post("/posts", postData);
    return response.data;
  },

  async uploadPostMedia(formData) {
    const response = await api.post(
      "/posts/upload",
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
  // Update
  // ==========================================

  async updatePost(postId, data) {
    const response = await api.put(
      `/posts/${postId}`,
      data
    );

    return response.data;
  },

  async deletePost(postId) {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  // ==========================================
  // Likes
  // ==========================================

  async likePost(postId) {
    const response = await api.post(
      `/posts/${postId}/like`
    );

    return response.data;
  },

  async unlikePost(postId) {
    const response = await api.delete(
      `/posts/${postId}/like`
    );

    return response.data;
  },

  // ==========================================
  // Save
  // ==========================================

  async savePost(postId) {
    const response = await api.post(
      `/posts/${postId}/save`
    );

    return response.data;
  },

  async unsavePost(postId) {
    const response = await api.delete(
      `/posts/${postId}/save`
    );

    return response.data;
  },

  // ==========================================
  // Comments
  // ==========================================

  async getComments(postId) {
    const response = await api.get(
      `/posts/${postId}/comments`
    );

    return response.data;
  },

  async addComment(postId, comment) {
    const response = await api.post(
      `/posts/${postId}/comments`,
      {
        comment,
      }
    );

    return response.data;
  },

  async editComment(postId, commentId, comment) {
    const response = await api.put(
      `/posts/${postId}/comments/${commentId}`,
      {
        comment,
      }
    );

    return response.data;
  },

  async deleteComment(postId, commentId) {
    const response = await api.delete(
      `/posts/${postId}/comments/${commentId}`
    );

    return response.data;
  },

  // ==========================================
  // Share
  // ==========================================

  async sharePost(postId) {
    const response = await api.post(
      `/posts/${postId}/share`
    );

    return response.data;
  },

  // ==========================================
  // Report
  // ==========================================

  async reportPost(postId, reason) {
    const response = await api.post(
      `/posts/${postId}/report`,
      {
        reason,
      }
    );

    return response.data;
  },

  // ==========================================
  // Polls
  // ==========================================

  async votePoll(postId, optionId) {
    const response = await api.post(
      `/posts/${postId}/poll`,
      {
        optionId,
      }
    );

    return response.data;
  },

  // ==========================================
  // Search
  // ==========================================

  async searchPosts(query) {
    const response = await api.get(
      "/posts/search",
      {
        params: {
          q: query,
        },
      }
    );

    return response.data;
  },

  // ==========================================
  // Admin
  // ==========================================

  async getReportedPosts() {
    const response = await api.get(
      "/admin/posts/reported"
    );

    return response.data;
  },

  async approvePost(postId) {
    const response = await api.patch(
      `/admin/posts/${postId}/approve`
    );

    return response.data;
  },

  async hidePost(postId) {
    const response = await api.patch(
      `/admin/posts/${postId}/hide`
    );

    return response.data;
  },

  async removePost(postId) {
    const response = await api.delete(
      `/admin/posts/${postId}`
    );

    return response.data;
  },

  async getFeedStatistics() {
    const response = await api.get(
      "/admin/posts/statistics"
    );

    return response.data;
  },
};

export default postService;

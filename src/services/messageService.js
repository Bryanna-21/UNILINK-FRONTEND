import api from "./api";

const messageService = {
  // ==========================================
  // Conversations
  // ==========================================

  async getConversations(page = 1, limit = 20) {
    const response = await api.get("/messages/conversations", {
      params: {
        page,
        limit,
      },
    });

    return response.data;
  },

  async getConversation(conversationId) {
    const response = await api.get(
      `/messages/conversations/${conversationId}`
    );

    return response.data;
  },

  async createConversation(data) {
    const response = await api.post(
      "/messages/conversations",
      data
    );

    return response.data;
  },

  async deleteConversation(conversationId) {
    const response = await api.delete(
      `/messages/conversations/${conversationId}`
    );

    return response.data;
  },

  // ==========================================
  // Messages
  // ==========================================

  async getMessages(
    conversationId,
    page = 1,
    limit = 50
  ) {
    const response = await api.get(
      `/messages/conversations/${conversationId}`,
      {
        params: {
          page,
          limit,
        },
      }
    );

    return response.data;
  },

  async sendMessage(conversationId, message) {
    const response = await api.post(
      `/messages/conversations/${conversationId}`,
      message
    );

    return response.data;
  },

  async editMessage(messageId, data) {
    const response = await api.put(
      `/messages/${messageId}`,
      data
    );

    return response.data;
  },

  async deleteMessage(messageId) {
    const response = await api.delete(
      `/messages/${messageId}`
    );

    return response.data;
  },

  // ==========================================
  // Media
  // ==========================================

  async uploadMedia(formData) {
    const response = await api.post(
      "/messages/upload",
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
  // Read Receipts
  // ==========================================

  async markAsRead(conversationId) {
    const response = await api.patch(
      `/messages/conversations/${conversationId}/read`
    );

    return response.data;
  },

  async markDelivered(messageId) {
    const response = await api.patch(
      `/messages/${messageId}/delivered`
    );

    return response.data;
  },

  // ==========================================
  // Reactions
  // ==========================================

  async reactToMessage(messageId, emoji) {
    const response = await api.post(
      `/messages/${messageId}/reaction`,
      {
        emoji,
      }
    );

    return response.data;
  },

  async removeReaction(messageId) {
    const response = await api.delete(
      `/messages/${messageId}/reaction`
    );

    return response.data;
  },

  // ==========================================
  // Search
  // ==========================================

  async searchMessages(query) {
    const response = await api.get(
      "/messages/search",
      {
        params: {
          q: query,
        },
      }
    );

    return response.data;
  },

  // ==========================================
  // Groups
  // ==========================================

  async createGroup(data) {
    const response = await api.post(
      "/messages/groups",
      data
    );

    return response.data;
  },

  async updateGroup(groupId, data) {
    const response = await api.put(
      `/messages/groups/${groupId}`,
      data
    );

    return response.data;
  },

  async joinGroup(groupId) {
    const response = await api.post(
      `/messages/groups/${groupId}/join`
    );

    return response.data;
  },

  async leaveGroup(groupId) {
    const response = await api.post(
      `/messages/groups/${groupId}/leave`
    );

    return response.data;
  },

  async deleteGroup(groupId) {
    const response = await api.delete(
      `/messages/groups/${groupId}`
    );

    return response.data;
  },

  // ==========================================
  // Typing Indicator
  // ==========================================

  async typing(conversationId) {
    const response = await api.post(
      `/messages/conversations/${conversationId}/typing`
    );

    return response.data;
  },

  async stopTyping(conversationId) {
    const response = await api.post(
      `/messages/conversations/${conversationId}/stop-typing`
    );

    return response.data;
  },

  // ==========================================
  // Archive
  // ==========================================

  async archiveConversation(conversationId) {
    const response = await api.patch(
      `/messages/conversations/${conversationId}/archive`
    );

    return response.data;
  },

  async unarchiveConversation(conversationId) {
    const response = await api.patch(
      `/messages/conversations/${conversationId}/unarchive`
    );

    return response.data;
  },

  // ==========================================
  // Block User
  // ==========================================

  async blockUser(userId) {
    const response = await api.post(
      `/messages/block/${userId}`
    );

    return response.data;
  },

  async unblockUser(userId) {
    const response = await api.delete(
      `/messages/block/${userId}`
    );

    return response.data;
  }
};

export default messageService;

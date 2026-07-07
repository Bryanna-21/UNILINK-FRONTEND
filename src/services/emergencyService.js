import api from "./api";

const emergencyService = {
  // ==========================================
  // Emergency Requests
  // ==========================================

  async createEmergency(data) {
    const response = await api.post("/emergencies", data);
    return response.data;
  },

  async getMyEmergencies(page = 1, limit = 20) {
    const response = await api.get("/emergencies/me", {
      params: {
        page,
        limit,
      },
    });

    return response.data;
  },

  async getEmergency(emergencyId) {
    const response = await api.get(
      `/emergencies/${emergencyId}`
    );

    return response.data;
  },

  async updateEmergency(emergencyId, data) {
    const response = await api.put(
      `/emergencies/${emergencyId}`,
      data
    );

    return response.data;
  },

  async cancelEmergency(emergencyId) {
    const response = await api.delete(
      `/emergencies/${emergencyId}`
    );

    return response.data;
  },

  // ==========================================
  // Emergency Evidence
  // ==========================================

  async uploadEvidence(formData) {
    const response = await api.post(
      "/emergencies/upload",
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
  // Live Location
  // ==========================================

  async updateLocation(emergencyId, location) {
    const response = await api.patch(
      `/emergencies/${emergencyId}/location`,
      location
    );

    return response.data;
  },

  // ==========================================
  // Responders
  // ==========================================

  async getNearbyResponders(latitude, longitude) {
    const response = await api.get(
      "/emergencies/responders",
      {
        params: {
          latitude,
          longitude,
        },
      }
    );

    return response.data;
  },

  async dispatchResponder(emergencyId, responderId) {
    const response = await api.post(
      `/emergencies/${emergencyId}/dispatch`,
      {
        responderId,
      }
    );

    return response.data;
  },

  // ==========================================
  // Status
  // ==========================================

  async acceptEmergency(emergencyId) {
    const response = await api.patch(
      `/emergencies/${emergencyId}/accept`
    );

    return response.data;
  },

  async arriveAtScene(emergencyId) {
    const response = await api.patch(
      `/emergencies/${emergencyId}/arrived`
    );

    return response.data;
  },

  async resolveEmergency(emergencyId) {
    const response = await api.patch(
      `/emergencies/${emergencyId}/resolved`
    );

    return response.data;
  },

  // ==========================================
  // Emergency Contacts
  // ==========================================

  async getEmergencyContacts() {
    const response = await api.get(
      "/emergencies/contacts"
    );

    return response.data;
  },

  async addEmergencyContact(data) {
    const response = await api.post(
      "/emergencies/contacts",
      data
    );

    return response.data;
  },

  async deleteEmergencyContact(contactId) {
    const response = await api.delete(
      `/emergencies/contacts/${contactId}`
    );

    return response.data;
  },

  // ==========================================
  // Admin
  // ==========================================

  async getAllEmergencies(page = 1, limit = 20) {
    const response = await api.get(
      "/admin/emergencies",
      {
        params: {
          page,
          limit,
        },
      }
    );

    return response.data;
  },

  async getEmergencyStatistics() {
    const response = await api.get(
      "/admin/emergencies/statistics"
    );

    return response.data;
  },
};

export default emergencyService;

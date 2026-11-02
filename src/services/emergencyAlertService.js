import api from "./api";

// GET /api/emergency/alerts/active - SOS alerts nobody has acknowledged yet (admins only).
// The server limits it to the admin's own university, and to the last few hours.
const emergencyAlertService = {
  async getActiveAlerts() {
    const { data } = await api.get("/emergency/alerts/active");
    return data;
  },
};

export default emergencyAlertService;

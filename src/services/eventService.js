import api from "./api";

/**
 * Event Service
 *
 * Real routes under /api/events: upcoming events at the user's own
 * university, RSVP, and the user's own RSVP for one event.
 */
const eventService = {
  getEvents: async () => {
    try {
      const response = await api.get("/events");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch events:", error);
      throw error;
    }
  },
  getMyRsvp: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}/my-rsvp`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch RSVP:", error);
      throw error;
    }
  },
  rsvp: async (eventId) => {
    try {
      const response = await api.post(`/events/${eventId}/rsvp`);
      return response.data;
    } catch (error) {
      console.error("Failed to RSVP:", error);
      throw error;
    }
  },
};

export default eventService;

import api from "./api";


/**
 * Announcement Service
 *
 * Handles:
 * - Lecturer announcements
 * - Student announcement feeds
 * - Course/unit broadcasts
 * - Announcement management
 */


const announcementService = {




  /**
   * Get all announcements
   */
  getAnnouncements: async () => {

    try {


      const response = await api.get(

        "/announcements"

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch announcements:",
        error
      );


      throw error;


    }

  },









  /**
   * Get announcement by ID
   */
  getAnnouncementById: async (

    announcementId

  ) => {

    try {


      const response = await api.get(

        `/announcements/${announcementId}`

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch announcement:",
        error
      );


      throw error;


    }

  },









  /**
   * Get announcements for a specific course
   */
  getCourseAnnouncements: async (

    courseId

  ) => {

    try {


      const response = await api.get(

        `/courses/${courseId}/announcements`

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch course announcements:",
        error
      );


      throw error;


    }

  },









  /**
   * Get announcements for a specific unit
   */
  getUnitAnnouncements: async (

    unitId

  ) => {

    try {


      const response = await api.get(

        `/units/${unitId}/announcements`

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch unit announcements:",
        error
      );


      throw error;


    }

  },









  /**
   * Get announcements created by lecturer
   */
  getLecturerAnnouncements: async () => {

    try {


      const response = await api.get(

        "/announcements/lecturer"

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch lecturer announcements:",
        error
      );


      throw error;


    }

  },









  /**
   * Create announcement
   */
  createAnnouncement: async (

    announcementData

  ) => {

    try {


      const response = await api.post(

        "/announcements",

        announcementData

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to create announcement:",
        error
      );


      throw error;


    }

  },









  /**
   * Update announcement
   */
  updateAnnouncement: async (

    announcementId,

    announcementData

  ) => {

    try {


      const response = await api.put(

        `/announcements/${announcementId}`,

        announcementData

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to update announcement:",
        error
      );


      throw error;


    }

  },









  /**
   * Delete announcement
   */
  deleteAnnouncement: async (

    announcementId

  ) => {

    try {


      const response = await api.delete(

        `/announcements/${announcementId}`

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to delete announcement:",
        error
      );


      throw error;


    }

  },









  /**
   * Mark announcement as read
   */
  markAsRead: async (

    announcementId

  ) => {

    try {


      const response = await api.put(

        `/announcements/${announcementId}/read`

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to mark announcement as read:",
        error
      );


      throw error;


    }

  }



};



export default announcementService;

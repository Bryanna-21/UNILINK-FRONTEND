import api from "./api";


/**
 * Timetable Service
 *
 * Handles:
 * - Student timetable
 * - Lecturer timetable
 * - Class schedules
 * - Timetable management
 */


const timetableService = {




  /**
   * Get complete timetable
   */
  getTimetable: async () => {

    try {


      const response = await api.get(
        "/timetable"
      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch timetable:",
        error
      );


      throw error;


    }

  },









  /**
   * Get current student's timetable
   */
  getStudentTimetable: async () => {

    try {


      const response = await api.get(

        "/timetable/student"

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch student timetable:",
        error
      );


      throw error;


    }

  },









  /**
   * Get lecturer timetable
   */
  getLecturerTimetable: async () => {

    try {


      const response = await api.get(

        "/timetable/lecturer"

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch lecturer timetable:",
        error
      );


      throw error;


    }

  },









  /**
   * Get timetable by day
   */
  getByDay: async (day) => {

    try {


      const response = await api.get(

        `/timetable/day/${day}`

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch daily timetable:",
        error
      );


      throw error;


    }

  },









  /**
   * Create timetable entry
   *
   * Admin use
   */
  createTimetableEntry: async (data) => {

    try {


      const response = await api.post(

        "/timetable",

        data

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to create timetable entry:",
        error
      );


      throw error;


    }

  },









  /**
   * Update timetable entry
   */
  updateTimetableEntry: async (

    timetableId,

    data

  ) => {

    try {


      const response = await api.put(

        `/timetable/${timetableId}`,

        data

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to update timetable:",
        error
      );


      throw error;


    }

  },









  /**
   * Delete timetable entry
   */
  deleteTimetableEntry: async (

    timetableId

  ) => {

    try {


      const response = await api.delete(

        `/timetable/${timetableId}`

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to delete timetable:",
        error
      );


      throw error;


    }

  },









  /**
   * Search timetable
   */
  searchTimetable: async (query) => {

    try {


      const response = await api.get(

        `/timetable/search?q=${query}`

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to search timetable:",
        error
      );


      throw error;


    }

  }



};



export default timetableService;

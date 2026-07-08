import api from "./api";


/**
 * Attendance Service
 *
 * Handles:
 * - Student attendance records
 * - Lecturer attendance marking
 * - Attendance reports
 * - Attendance statistics
 */


const attendanceService = {




  /**
   * Get all attendance records
   */
  getAttendance: async () => {

    try {


      const response = await api.get(

        "/attendance"

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch attendance:",
        error
      );


      throw error;


    }

  },









  /**
   * Get current student's attendance
   */
  getStudentAttendance: async () => {

    try {


      const response = await api.get(

        "/attendance/student"

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch student attendance:",
        error
      );


      throw error;


    }

  },









  /**
   * Get attendance by unit
   */
  getUnitAttendance: async (unitId) => {

    try {


      const response = await api.get(

        `/attendance/unit/${unitId}`

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch unit attendance:",
        error
      );


      throw error;


    }

  },









  /**
   * Get lecturer attendance records
   */
  getLecturerAttendance: async () => {

    try {


      const response = await api.get(

        "/attendance/lecturer"

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch lecturer attendance:",
        error
      );


      throw error;


    }

  },









  /**
   * Mark attendance
   *
   * Lecturer use
   */
  markAttendance: async (attendanceData) => {

    try {


      const response = await api.post(

        "/attendance/mark",

        attendanceData

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to mark attendance:",
        error
      );


      throw error;


    }

  },









  /**
   * Update attendance record
   */
  updateAttendance: async (

    attendanceId,

    data

  ) => {

    try {


      const response = await api.put(

        `/attendance/${attendanceId}`,

        data

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to update attendance:",
        error
      );


      throw error;


    }

  },









  /**
   * Delete attendance record
   */
  deleteAttendance: async (

    attendanceId

  ) => {

    try {


      const response = await api.delete(

        `/attendance/${attendanceId}`

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to delete attendance:",
        error
      );


      throw error;


    }

  },









  /**
   * Get attendance statistics
   */
  getAttendanceStats: async () => {

    try {


      const response = await api.get(

        "/attendance/statistics"

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch attendance statistics:",
        error
      );


      throw error;


    }

  }



};



export default attendanceService;

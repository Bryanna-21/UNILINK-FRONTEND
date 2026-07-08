import api from "./api";


/**
 * Unit Service
 *
 * Handles:
 * - Fetching units
 * - Fetching units by course
 * - Student unit access
 * - Lecturer unit management
 * - Creating and updating units
 */


const unitService = {



  /**
   * Get all units
   */
  getUnits: async () => {

    try {

      const response = await api.get(
        "/units"
      );


      return response.data;


    } catch (error) {


      console.error(
        "Failed to fetch units:",
        error
      );


      throw error;


    }

  },







  /**
   * Get a single unit
   */
  getUnitById: async (unitId) => {

    try {


      const response = await api.get(

        `/units/${unitId}`

      );


      return response.data;



    } catch (error) {


      console.error(
        "Failed to fetch unit:",
        error
      );


      throw error;


    }

  },








  /**
   * Get units under a specific course
   */
  getCourseUnits: async (courseId) => {

    try {


      const response = await api.get(

        `/courses/${courseId}/units`

      );


      return response.data;



    } catch (error) {


      console.error(
        "Failed to fetch course units:",
        error
      );


      throw error;


    }

  },








  /**
   * Get units assigned to current student
   */
  getMyUnits: async () => {

    try {


      const response = await api.get(

        "/units/my-units"

      );


      return response.data;



    } catch (error) {


      console.error(
        "Failed to fetch student units:",
        error
      );


      throw error;


    }

  },








  /**
   * Get units assigned to lecturer
   */
  getLecturerUnits: async () => {

    try {


      const response = await api.get(

        "/units/lecturer"

      );


      return response.data;



    } catch (error) {


      console.error(
        "Failed to fetch lecturer units:",
        error
      );


      throw error;


    }

  },









  /**
   * Create new unit
   */
  createUnit: async (unitData) => {

    try {


      const response = await api.post(

        "/units",

        unitData

      );


      return response.data;



    } catch (error) {


      console.error(
        "Failed to create unit:",
        error
      );


      throw error;


    }

  },








  /**
   * Update unit
   */
  updateUnit: async (

    unitId,

    unitData

  ) => {


    try {


      const response = await api.put(

        `/units/${unitId}`,

        unitData

      );


      return response.data;



    } catch(error){


      console.error(
        "Failed to update unit:",
        error
      );


      throw error;


    }

  },









  /**
   * Delete unit
   */
  deleteUnit: async (unitId) => {

    try {


      const response = await api.delete(

        `/units/${unitId}`

      );


      return response.data;



    } catch(error){


      console.error(
        "Failed to delete unit:",
        error
      );


      throw error;


    }

  }



};



export default unitService;

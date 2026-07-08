import api from "./api";


/**
 * Course Service
 * 
 * Handles:
 * - Fetching courses
 * - Fetching single course details
 * - Creating courses (admin/lecturer)
 * - Updating courses
 * - Removing courses
 */


const courseService = {


  /**
   * Get all courses
   */
  getCourses: async () => {

    try {

      const response = await api.get("/courses");

      return response.data;


    } catch (error) {

      console.error(
        "Failed to fetch courses:",
        error
      );

      throw error;

    }

  },




  /**
   * Get single course by ID
   */
  getCourseById: async (courseId) => {

    try {

      const response = await api.get(
        `/courses/${courseId}`
      );


      return response.data;


    } catch (error) {

      console.error(
        "Failed to fetch course:",
        error
      );


      throw error;

    }

  },





  /**
   * Get courses belonging to current student
   */
  getMyCourses: async () => {

    try {

      const response = await api.get(
        "/courses/my-courses"
      );


      return response.data;


    } catch (error) {

      console.error(
        "Failed to fetch enrolled courses:",
        error
      );


      throw error;

    }

  },





  /**
   * Get courses assigned to lecturer
   */
  getLecturerCourses: async () => {

    try {

      const response = await api.get(
        "/courses/lecturer"
      );


      return response.data;


    } catch (error) {

      console.error(
        "Failed to fetch lecturer courses:",
        error
      );


      throw error;

    }

  },






  /**
   * Create new course
   */
  createCourse: async (courseData) => {

    try {

      const response = await api.post(
        "/courses",
        courseData
      );


      return response.data;


    } catch (error) {

      console.error(
        "Failed to create course:",
        error
      );


      throw error;

    }

  },







  /**
   * Update course
   */
  updateCourse: async (
    courseId,
    courseData
  ) => {

    try {

      const response = await api.put(

        `/courses/${courseId}`,

        courseData

      );


      return response.data;


    } catch (error) {

      console.error(
        "Failed to update course:",
        error
      );


      throw error;

    }

  },








  /**
   * Delete course
   */
  deleteCourse: async (courseId) => {

    try {


      const response = await api.delete(

        `/courses/${courseId}`

      );


      return response.data;



    } catch (error) {


      console.error(
        "Failed to delete course:",
        error
      );


      throw error;


    }

  }


};



export default courseService;

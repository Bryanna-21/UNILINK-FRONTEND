import api from "./api";


/**
 * Assignment Service
 *
 * Handles:
 * - Fetching assignments
 * - Creating assignments
 * - Student submissions
 * - Lecturer grading workflow
 * - Assignment attachments
 */


const assignmentService = {




  /**
   * Get all assignments
   */
  getAssignments: async () => {

    try {

      const response = await api.get(
        "/assignments"
      );


      return response.data;


    } catch(error) {

      console.error(
        "Failed to fetch assignments:",
        error
      );


      throw error;

    }

  },








  /**
   * Get assignment by ID
   */
  getAssignmentById: async (assignmentId) => {

    try {


      const response = await api.get(

        `/assignments/${assignmentId}`

      );


      return response.data;


    } catch(error) {


      console.error(
        "Failed to fetch assignment:",
        error
      );


      throw error;


    }

  },









  /**
   * Get assignments for a specific unit
   */
  getUnitAssignments: async (unitId) => {

    try {


      const response = await api.get(

        `/units/${unitId}/assignments`

      );


      return response.data;


    } catch(error) {


      console.error(
        "Failed to fetch unit assignments:",
        error
      );


      throw error;


    }

  },









  /**
   * Get assignments created by lecturer
   */
  getLecturerAssignments: async () => {

    try {


      const response = await api.get(

        "/assignments/lecturer"

      );


      return response.data;


    } catch(error) {


      console.error(
        "Failed to fetch lecturer assignments:",
        error
      );


      throw error;


    }

  },









  /**
   * Create assignment
   *
   * Supports file attachment
   */
  createAssignment: async (assignmentData) => {


    try {


      const formData = new FormData();



      formData.append(
        "title",
        assignmentData.title
      );



      formData.append(
        "unit",
        assignmentData.unit
      );



      formData.append(
        "description",
        assignmentData.description
      );



      formData.append(
        "deadline",
        assignmentData.deadline
      );




      if(assignmentData.attachment){

        formData.append(
          "attachment",
          assignmentData.attachment
        );

      }







      const response = await api.post(

        "/assignments",

        formData,

        {

          headers:{

            "Content-Type":
              "multipart/form-data"

          }

        }

      );



      return response.data;



    } catch(error) {


      console.error(
        "Failed to create assignment:",
        error
      );


      throw error;


    }


  },









  /**
   * Submit assignment
   */
  submitAssignment: async (

    assignmentId,

    submissionData

  ) => {


    try {


      const formData = new FormData();




      formData.append(

        "assignmentId",

        assignmentId

      );





      if(submissionData.file){

        formData.append(

          "file",

          submissionData.file

        );

      }






      if(submissionData.comment){

        formData.append(

          "comment",

          submissionData.comment

        );

      }







      const response = await api.post(

        `/assignments/${assignmentId}/submit`,

        formData,

        {

          headers:{

            "Content-Type":
              "multipart/form-data"

          }

        }

      );



      return response.data;



    } catch(error) {


      console.error(
        "Failed to submit assignment:",
        error
      );


      throw error;


    }


  },









  /**
   * Get student submissions
   */
  getMySubmissions: async () => {


    try {


      const response = await api.get(

        "/assignments/submissions/me"

      );


      return response.data;



    } catch(error){


      console.error(
        "Failed to fetch submissions:",
        error
      );


      throw error;


    }


  },









  /**
   * Get submissions for lecturer grading
   */
  getSubmissions: async (assignmentId) => {


    try {


      const response = await api.get(

        `/assignments/${assignmentId}/submissions`

      );


      return response.data;



    } catch(error){


      console.error(
        "Failed to fetch assignment submissions:",
        error
      );


      throw error;


    }


  },









  /**
   * Grade submission
   */
  gradeSubmission: async (

    submissionId,

    gradeData

  ) => {


    try {


      const response = await api.put(

        `/assignments/submissions/${submissionId}/grade`,

        gradeData

      );


      return response.data;



    } catch(error){


      console.error(
        "Failed to grade submission:",
        error
      );


      throw error;


    }


  },









  /**
   * Delete assignment
   */
  deleteAssignment: async (assignmentId) => {


    try {


      const response = await api.delete(

        `/assignments/${assignmentId}`

      );


      return response.data;



    } catch(error){


      console.error(
        "Failed to delete assignment:",
        error
      );


      throw error;


    }


  }



};



export default assignmentService;

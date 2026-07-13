import api from "./api";


/**
 * Note Service
 *
 * Handles:
 * - Fetching notes
 * - Uploading learning materials
 * - Downloading notes
 * - Searching notes
 * - Lecturer note management
 */


const noteService = {




  /**
   * Get all notes
   */
  getNotes: async () => {

    try {


      const response = await api.get(
        "/notes"
      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch notes:",
        error
      );


      throw error;


    }

  },








  /**
   * Get note by ID
   */
  getNoteById: async (noteId) => {

    try {


      const response = await api.get(

        `/notes/${noteId}`

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch note:",
        error
      );


      throw error;


    }

  },









  /**
   * Get notes for a specific unit
   */
  getUnitNotes: async (unitId) => {

    try {


      const response = await api.get(

        `/units/${unitId}/notes`

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch unit notes:",
        error
      );


      throw error;


    }

  },









  /**
   * Get notes uploaded by lecturer
   */
  getLecturerNotes: async () => {

    try {


      const response = await api.get(

        "/notes/lecturer"

      );


      return response.data;



    } catch(error) {


      console.error(
        "Failed to fetch lecturer notes:",
        error
      );


      throw error;


    }

  },









  /**
   * Upload notes
   *
   * Uses FormData because files are included
   */
  uploadNote: async (noteData) => {


    try {


      const formData = new FormData();



      formData.append(
        "title",
        noteData.title
      );


      formData.append(
        "unit",
        noteData.unit
      );


      formData.append(
        "description",
        noteData.description
      );



      if(noteData.file){

        formData.append(
          "file",
          noteData.file
        );

      }





      const response = await api.post(

        "/notes/upload",

        formData,

        {

          headers:{

            "Content-Type":
              "multipart/form-data"

          }

        }

      );



      return response.data;



    } catch(error){


      console.error(
        "Failed to upload note:",
        error
      );


      throw error;


    }


  },









  /**
   * Download note
   */
  downloadNote: async (noteId) => {


    try {


      const response = await api.get(

        `/notes/${noteId}/download`,

        {

          responseType:"blob"

        }

      );


      return response.data;



    } catch(error){


      console.error(
        "Failed to download note:",
        error
      );


      throw error;


    }


  },









  /**
   * Search notes
   */
  searchNotes: async (query) => {


    try {


      const response = await api.get(

        `/notes/search?q=${query}`

      );


      return response.data;



    } catch(error){


      console.error(
        "Failed to search notes:",
        error
      );


      throw error;


    }


  },









  /**
   * Toggle favourite status on a note
   */
  toggleFavourite: async (noteId) => {

    try {


      const response = await api.put(

        `/notes/${noteId}/favourite`

      );


      return response.data;



    } catch(error){


      console.error(
        "Failed to toggle favourite:",
        error
      );


      throw error;


    }


  },



  /**
   * Delete note
   */
  deleteNote: async (noteId) => {


    try {


      const response = await api.delete(

        `/notes/${noteId}`

      );


      return response.data;



    } catch(error){


      console.error(
        "Failed to delete note:",
        error
      );


      throw error;


    }


  }



};



export default noteService;

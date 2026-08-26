import React, { useState } from "react";
import {
  FaCloudUploadAlt,
  FaFileAlt,
  FaBook
} from "react-icons/fa";
import "./UploadNotes.css";


const UploadNotes = () => {

  const [formData, setFormData] = useState({

    title: "",
    unit: "",
    description: "",
    file: null

  });



  const handleChange = (e) => {

    const { name, value, files } = e.target;


    setFormData({

      ...formData,

      [name]:
        files
        ? files[0]
        : value

    });

  };



  const handleSubmit = (e) => {

    e.preventDefault();


    console.log(
      "Uploading notes:",
      formData
    );


    /*
      Later:

      Connect to uploadService
      Send multipart/form-data
    */


    setFormData({

      title:"",
      unit:"",
      description:"",
      file:null

    });

  };



  return (

    <div className="upload-notes-page">




      <main className="upload-notes-content">


        <div className="upload-header">

          <h1>
            Upload Notes
          </h1>


          <p>
            Share learning materials with your students.
          </p>

        </div>




        <form
          className="upload-form"
          onSubmit={handleSubmit}
        >



          <div className="form-group">

            <label>
              <FaFileAlt />
              Note Title
            </label>


            <input

              type="text"

              name="title"

              value={formData.title}

              onChange={handleChange}

              placeholder="Enter note title"

              required

            />

          </div>





          <div className="form-group">

            <label>
              <FaBook />
              Unit
            </label>


            <input

              type="text"

              name="unit"

              value={formData.unit}

              onChange={handleChange}

              placeholder="Enter unit name"

              required

            />

          </div>





          <div className="form-group">


            <label>
              Description
            </label>


            <textarea

              name="description"

              value={formData.description}

              onChange={handleChange}

              placeholder="Describe the notes"

              rows="5"

            />


          </div>





          <div className="file-upload">


            <label>

              <FaCloudUploadAlt />

              Upload PDF / Document


            </label>


            <input

              type="file"

              name="file"

              accept=".pdf,.doc,.docx"

              onChange={handleChange}

              required

            />


          </div>





          <button
            className="upload-button"
            type="submit"
          >

            Upload Notes

          </button>



        </form>



      </main>


    </div>

  );

};


export default UploadNotes;

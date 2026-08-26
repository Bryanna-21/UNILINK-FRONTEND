import React, { useState } from "react";
import {
  FaClipboardList,
  FaBook,
  FaCalendarAlt,
  FaPaperclip
} from "react-icons/fa";
import "./CreateAssignment.css";


const CreateAssignment = () => {


  const [assignment, setAssignment] = useState({

    title: "",
    unit: "",
    description: "",
    deadline: "",
    attachment: null

  });



  const handleChange = (e) => {

    const { name, value, files } = e.target;


    setAssignment({

      ...assignment,

      [name]:
        files
        ? files[0]
        : value

    });

  };



  const handleSubmit = (e) => {

    e.preventDefault();


    console.log(
      "Creating assignment:",
      assignment
    );


    /*
      Later:

      Connect to assignmentService
      Submit assignment data
      Upload attachments
    */


    setAssignment({

      title:"",
      unit:"",
      description:"",
      deadline:"",
      attachment:null

    });

  };



  return (

    <div className="create-assignment-page">




      <main className="create-assignment-content">


        <div className="create-assignment-header">

          <h1>
            Create Assignment
          </h1>


          <p>
            Publish assignments for students and track submissions.
          </p>

        </div>




        <form

          className="assignment-form"

          onSubmit={handleSubmit}

        >



          <div className="assignment-form-group">

            <label>

              <FaClipboardList />

              Assignment Title

            </label>


            <input

              type="text"

              name="title"

              value={assignment.title}

              onChange={handleChange}

              placeholder="Enter assignment title"

              required

            />

          </div>





          <div className="assignment-form-group">

            <label>

              <FaBook />

              Unit

            </label>


            <input

              type="text"

              name="unit"

              value={assignment.unit}

              onChange={handleChange}

              placeholder="Enter unit name"

              required

            />

          </div>





          <div className="assignment-form-group">


            <label>

              Assignment Instructions

            </label>


            <textarea

              name="description"

              value={assignment.description}

              onChange={handleChange}

              placeholder="Provide assignment instructions"

              rows="6"

              required

            />


          </div>





          <div className="assignment-form-group">

            <label>

              <FaCalendarAlt />

              Submission Deadline

            </label>


            <input

              type="date"

              name="deadline"

              value={assignment.deadline}

              onChange={handleChange}

              required

            />

          </div>





          <div className="assignment-file">


            <label>

              <FaPaperclip />

              Attach File

            </label>


            <input

              type="file"

              name="attachment"

              accept=".pdf,.doc,.docx"

              onChange={handleChange}

            />


          </div>





          <button

            className="publish-assignment-button"

            type="submit"

          >

            Publish Assignment

          </button>




        </form>



      </main>


    </div>

  );

};


export default CreateAssignment;

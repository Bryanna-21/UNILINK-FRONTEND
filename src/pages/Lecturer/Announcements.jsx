import React, { useEffect, useState } from "react";
import AcademicSidebar from "../../components/academic/AcademicSidebar";
import {
  FaBullhorn,
  FaCalendarAlt,
  FaUsers
} from "react-icons/fa";
import "./Announcements.css";


const Announcements = () => {


  const [announcement, setAnnouncement] = useState({

    title: "",
    message: "",
    target: "All Students"

  });



  const [announcements, setAnnouncements] = useState([]);




  useEffect(() => {


    /*
      Temporary frontend data.
      Replace with announcementService API later.
    */


    setAnnouncements([

      {
        id:1,
        title:"Assignment Deadline Reminder",
        message:
          "Remember to submit your database project before the deadline.",
        target:"CS202 Students",
        date:"08 July 2026"
      },


      {
        id:2,
        title:"Lecture Schedule Update",
        message:
          "The Friday lecture has been moved to the afternoon session.",
        target:"Computer Science Students",
        date:"06 July 2026"
      }

    ]);


  }, []);




  const handleChange = (e)=>{


    const {name,value}=e.target;


    setAnnouncement({

      ...announcement,

      [name]:value

    });


  };





  const handleSubmit=(e)=>{


    e.preventDefault();


    const newAnnouncement={

      id:Date.now(),

      title:announcement.title,

      message:announcement.message,

      target:announcement.target,

      date:new Date().toLocaleDateString()

    };



    setAnnouncements([

      newAnnouncement,

      ...announcements

    ]);



    setAnnouncement({

      title:"",

      message:"",

      target:"All Students"

    });



    /*
      Later:

      Connect to notificationService
      Send real-time notifications
    */


  };





  return (

    <div className="announcements-page">


      <AcademicSidebar />


      <main className="announcements-content">


        <div className="announcements-header">


          <h1>
            Class Announcements
          </h1>


          <p>
            Communicate important academic updates with students.
          </p>


        </div>





        <form

          className="announcement-form"

          onSubmit={handleSubmit}

        >


          <div className="announcement-group">


            <label>

              <FaBullhorn />

              Title

            </label>


            <input

              type="text"

              name="title"

              value={announcement.title}

              onChange={handleChange}

              placeholder="Announcement title"

              required

            />


          </div>





          <div className="announcement-group">


            <label>
              Message
            </label>


            <textarea

              name="message"

              value={announcement.message}

              onChange={handleChange}

              placeholder="Write announcement..."

              rows="5"

              required

            />


          </div>





          <div className="announcement-group">


            <label>

              <FaUsers />

              Audience

            </label>


            <select

              name="target"

              value={announcement.target}

              onChange={handleChange}

            >

              <option>
                All Students
              </option>

              <option>
                Specific Unit
              </option>

              <option>
                Specific Course
              </option>


            </select>


          </div>




          <button

            className="publish-announcement"

            type="submit"

          >

            Publish Announcement

          </button>



        </form>






        <div className="announcement-list">


          {

            announcements.map((item)=>(


              <div

                className="announcement-card"

                key={item.id}

              >


                <div className="announcement-card-header">


                  <FaBullhorn />


                  <h3>
                    {item.title}
                  </h3>


                </div>




                <p>
                  {item.message}
                </p>





                <div className="announcement-meta">


                  <span>

                    <FaUsers />

                    {item.target}

                  </span>



                  <span>

                    <FaCalendarAlt />

                    {item.date}

                  </span>


                </div>



              </div>


            ))

          }


        </div>



      </main>


    </div>

  );

};


export default Announcements;

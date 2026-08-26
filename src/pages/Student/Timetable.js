import React, { useEffect, useState } from "react";
import TimetableCard from "../../components/academic/TimetableCard";
import "./Timetable.css";


const Timetable = () => {

  const [timetable, setTimetable] = useState([]);



  useEffect(() => {

    /*
      Temporary frontend data.
      Replace with timetableService API later.
    */

    const demoTimetable = [

      {
        id: 1,
        day: "Monday",
        unit: "Data Structures and Algorithms",
        code: "CS201",
        time: "8:00 AM - 10:00 AM",
        room: "Lab 2",
        lecturer: "Dr. James Kariuki"
      },


      {
        id: 2,
        day: "Tuesday",
        unit: "Database Management Systems",
        code: "CS202",
        time: "10:00 AM - 12:00 PM",
        room: "Room B12",
        lecturer: "Dr. Mary Wanjiku"
      },


      {
        id: 3,
        day: "Thursday",
        unit: "Software Engineering",
        code: "CS203",
        time: "2:00 PM - 4:00 PM",
        room: "Lecture Hall 4",
        lecturer: "Mr. Peter Otieno"
      },


      {
        id: 4,
        day: "Friday",
        unit: "Computer Networks",
        code: "CS204",
        time: "9:00 AM - 11:00 AM",
        room: "Network Lab",
        lecturer: "Mr. David Kiptoo"
      }

    ];


    setTimetable(demoTimetable);


  }, []);



  return (

    <div className="timetable-page">




      <main className="timetable-content">


        <div className="timetable-header">

          <h1>
            My Timetable
          </h1>


          <p>
            View your weekly class schedule and lecture information.
          </p>

        </div>



        <div className="timetable-grid">


          {
            timetable.length > 0 ?


            timetable.map((item) => (

              <TimetableCard

                key={item.id}

                timetable={item}

              />

            ))


            :


            <div className="empty-timetable">

              No timetable available.

            </div>

          }


        </div>



      </main>


    </div>

  );

};


export default Timetable;

import React, { useEffect, useState } from "react";
import TimetableCard from "../../components/academic/TimetableCard";
import "./Timetable.css";


const Timetable = () => {

  const [timetable, setTimetable] = useState([]);



  useEffect(() => { let active=true; import("../../services/timetableService").then(({default:service})=>service.getMyTimetable()).then(raw=>{if(active)setTimetable(Array.isArray(raw)?raw:[])}).catch(()=>{if(active)setTimetable([])}); return ()=>{active=false}; }, []);



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

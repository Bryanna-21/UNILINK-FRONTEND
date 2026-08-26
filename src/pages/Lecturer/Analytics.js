import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaClipboardCheck,
  FaChartLine,
  FaGraduationCap
} from "react-icons/fa";
import "./Analytics.css";


const Analytics = () => {


  const [analytics, setAnalytics] = useState({

    students: 0,
    submissions: 0,
    averageScore: 0,
    attendance: 0

  });




  useEffect(() => {


    /*
      Temporary frontend analytics data.
      Replace with analyticsService API later.
    */


    setAnalytics({

      students:120,

      submissions:96,

      averageScore:78,

      attendance:89

    });



  }, []);




  const cards = [

    {
      title:"Total Students",
      value:analytics.students,
      icon:<FaUsers />
    },


    {
      title:"Assignments Submitted",
      value:analytics.submissions,
      icon:<FaClipboardCheck />
    },


    {
      title:"Average Performance",
      value:`${analytics.averageScore}%`,
      icon:<FaChartLine />
    },


    {
      title:"Attendance Rate",
      value:`${analytics.attendance}%`,
      icon:<FaGraduationCap />
    }

  ];




  return (

    <div className="analytics-page">




      <main className="analytics-content">


        <div className="analytics-header">


          <h1>
            Lecturer Analytics
          </h1>


          <p>
            Monitor student engagement and academic performance.
          </p>


        </div>





        <div className="analytics-grid">


          {

            cards.map((card,index)=>(


              <div

                className="analytics-card"

                key={index}

              >


                <div className="analytics-icon">

                  {card.icon}

                </div>



                <div className="analytics-details">


                  <h3>

                    {card.title}

                  </h3>


                  <strong>

                    {card.value}

                  </strong>


                </div>



              </div>


            ))

          }


        </div>





        <div className="performance-section">


          <h2>
            Class Performance Overview
          </h2>



          <div className="performance-bars">


            <div className="performance-item">


              <span>
                Assignments Completion
              </span>


              <div className="bar">

                <div

                  className="fill"

                  style={{
                    width:"80%"
                  }}

                >

                </div>

              </div>


            </div>





            <div className="performance-item">


              <span>
                Attendance
              </span>


              <div className="bar">

                <div

                  className="fill"

                  style={{
                    width:"89%"
                  }}

                >

                </div>

              </div>


            </div>





            <div className="performance-item">


              <span>
                Average Grades
              </span>


              <div className="bar">

                <div

                  className="fill"

                  style={{
                    width:"78%"
                  }}

                >

                </div>

              </div>


            </div>



          </div>


        </div>



      </main>


    </div>

  );

};


export default Analytics;

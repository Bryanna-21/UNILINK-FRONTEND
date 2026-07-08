import React from "react";
import {
  FaBook,
  FaLayerGroup,
  FaFileAlt,
  FaClipboardList,
  FaCalendarAlt,
  FaChartBar
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./AcademicSidebar.css";


const AcademicSidebar = () => {

  const menuItems = [

    {
      name: "Courses",
      path: "/student/courses",
      icon: <FaBook />
    },

    {
      name: "Units",
      path: "/student/units",
      icon: <FaLayerGroup />
    },

    {
      name: "Notes",
      path: "/student/notes",
      icon: <FaFileAlt />
    },

    {
      name: "Assignments",
      path: "/student/assignments",
      icon: <FaClipboardList />
    },

    {
      name: "Timetable",
      path: "/student/timetable",
      icon: <FaCalendarAlt />
    },

    {
      name: "Academic Progress",
      path: "/student/progress",
      icon: <FaChartBar />
    }

  ];


  return (

    <aside className="academic-sidebar">

      <div className="academic-sidebar-header">

        <h2>
          Academic
        </h2>

        <p>
          UniLink Learning Hub
        </p>

      </div>



      <nav className="academic-navigation">


        {
          menuItems.map((item, index) => (

            <NavLink

              key={index}

              to={item.path}

              className={({isActive}) =>
                isActive
                ? "academic-link active"
                : "academic-link"
              }

            >

              <span className="academic-icon">
                {item.icon}
              </span>


              <span>
                {item.name}
              </span>


            </NavLink>

          ))
        }


      </nav>


    </aside>

  );

};


export default AcademicSidebar;

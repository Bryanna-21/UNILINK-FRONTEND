import React, { useEffect, useState } from "react";
import UnitCard from "../../components/academic/UnitCard";
import "./Units.css";


const Units = () => {

  const [units, setUnits] = useState([]);



  useEffect(() => {

    /*
      Temporary frontend data.
      Replace with API integration later.
    */

    const demoUnits = [

      {
        id: 1,
        name: "Data Structures and Algorithms",
        code: "CS201",
        description:
          "Study data organization, algorithms, searching and optimization techniques.",
        notes: 15,
        assignments: 4,
        members: 80
      },


      {
        id: 2,
        name: "Database Management Systems",
        code: "CS202",
        description:
          "Learn database design, SQL, normalization and database administration.",
        notes: 20,
        assignments: 3,
        members: 95
      },


      {
        id: 3,
        name: "Software Engineering",
        code: "CS203",
        description:
          "Explore software development methodologies, testing and project management.",
        notes: 18,
        assignments: 5,
        members: 100
      }

    ];


    setUnits(demoUnits);


  }, []);



  const handleUnitOpen = (unit) => {

    console.log(
      "Opening unit:",
      unit
    );

    /*
      Later:

      navigate(
        `/student/units/${unit.id}`
      )

    */

  };



  return (

    <div className="units-page">




      <main className="units-content">


        <div className="units-header">

          <h1>
            My Units
          </h1>


          <p>
            Access unit materials, assignments, discussions and academic resources.
          </p>

        </div>




        <div className="units-grid">


          {
            units.length > 0 ?


            units.map((unit) => (

              <UnitCard

                key={unit.id}

                unit={unit}

                onClick={handleUnitOpen}

              />

            ))


            :


            <div className="empty-units">

              No units available.

            </div>


          }


        </div>



      </main>


    </div>

  );

};


export default Units;

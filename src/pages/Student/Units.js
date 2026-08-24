import React, { useEffect, useState } from "react";
import UnitCard from "../../components/academic/UnitCard";
import "./Units.css";


const Units = () => {

  const [units, setUnits] = useState([]);



  useEffect(() => { let active=true; import("../../services/unitService").then(({default:service})=>service.getMyUnits()).then(raw=>{if(active)setUnits(Array.isArray(raw)?raw:[])}).catch(()=>{if(active)setUnits([])}); return ()=>{active=false}; }, []);



  const handleUnitOpen = (unit) => {

    window.location.href = `/student/units/${unit.id}`;

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

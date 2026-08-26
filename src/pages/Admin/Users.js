import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
  FaSearch
} from "react-icons/fa";
import "./Users.css";


const Users = () => {


  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");




  useEffect(() => {


    /*
      Temporary frontend data.

      Replace later with:
      adminService.getUsers()
    */


    const demoUsers = [


      {
        id:1,
        name:"John Kamau",
        email:"john@student.com",
        role:"Student",
        university:"Kenya Highlands University",
        status:"Verified"
      },


      {
        id:2,
        name:"Dr. Mary Wanjiku",
        email:"mary@university.ac.ke",
        role:"Lecturer",
        university:"Kenya Highlands University",
        status:"Verified"
      },


      {
        id:3,
        name:"Admin User",
        email:"admin@unilink.com",
        role:"Admin",
        university:"System",
        status:"Active"
      }


    ];


    setUsers(demoUsers);


  }, []);






  const filteredUsers = users.filter((user)=>


    user.name
    .toLowerCase()
    .includes(
      search.toLowerCase()
    )


  );






  const getRoleIcon = (role)=>{


    if(role==="Student")
      return <FaUserGraduate />;


    if(role==="Lecturer")
      return <FaChalkboardTeacher />;


    return <FaUserShield />;


  };






  return (

    <div className="admin-users-page">





      <main className="admin-users-content">



        <div className="users-header">


          <h1>
            User Management
          </h1>


          <p>
            Manage students, lecturers and administrators.
          </p>


        </div>






        <div className="users-tools">


          <div className="search-box">


            <FaSearch />


            <input

              type="text"

              placeholder="Search users..."

              value={search}

              onChange={(e)=>
                setSearch(e.target.value)
              }

            />


          </div>


        </div>








        <div className="users-table-container">


          <table className="users-table">


            <thead>

              <tr>

                <th>
                  User
                </th>

                <th>
                  Role
                </th>

                <th>
                  University
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>




            <tbody>


              {

                filteredUsers.map((user)=>(


                  <tr key={user.id}>


                    <td>


                      <div className="user-info">


                        <FaUsers />


                        <div>

                          <strong>
                            {user.name}
                          </strong>


                          <small>
                            {user.email}
                          </small>


                        </div>


                      </div>


                    </td>





                    <td>


                      <span className="role">


                        {getRoleIcon(user.role)}


                        {user.role}


                      </span>


                    </td>






                    <td>

                      {user.university}

                    </td>






                    <td>


                      <span className="status">


                        {user.status}


                      </span>


                    </td>




                  </tr>


                ))

              }


            </tbody>


          </table>


        </div>




      </main>


    </div>

  );

};


export default Users;

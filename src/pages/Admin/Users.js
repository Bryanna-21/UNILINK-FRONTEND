import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
  FaSearch
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getUsers } from "../../services/adminService";
import "./Users.css";


const Users = () => {


  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");




  useEffect(() => {

    const loadUsers = async () => {

      try {

        setLoading(true);

        const data = await getUsers();

        setUsers(data || []);

      } catch (error) {

        toast.error("Unable to load users.");

      } finally {

        setLoading(false);

      }

    };

    loadUsers();

  }, []);




  const filteredUsers = users.filter((user)=>


    user.name
    .toLowerCase()
    .includes(
      search.toLowerCase()
    )


  );



  // Real values from the backend are lowercase ("student", "active",
  // etc); displayed capitalized to match the design this page already
  // had, without changing what's actually stored. Used for both role
  // and status, hence the generic name.
  const capitalize = (value) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : "Unknown";

  const getRoleIcon = (role)=>{


    if(role==="student")
      return <FaUserGraduate />;


    if(role==="lecturer")
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

                loading ? (

                  <tr>
                    <td colSpan={4}>Loading users...</td>
                  </tr>

                ) : filteredUsers.length === 0 ? (

                  <tr>
                    <td colSpan={4}>No users found.</td>
                  </tr>

                ) : filteredUsers.map((user)=>(


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


                        {capitalize(user.role)}


                      </span>


                    </td>






                    <td>

                      {user.university || "—"}

                    </td>






                    <td>


                      <span className="status">


                        {capitalize(user.status)}


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

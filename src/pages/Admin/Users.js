import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
  FaSearch
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getUsers, changeUserRole } from "../../services/adminService";
import "./Users.css";


const Users = () => {


  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // The person whose role is being changed right now (one at a time).
  const [changingId, setChangingId] = useState(null);

  const ROLE_BUTTON = { lecturer: "Make lecturer", admin: "Make admin", student: "Make student" };

  const handleChangeRole = async (user, role) => {
    const ok = window.confirm(
      `Make ${user.name} ${role === "admin" ? "an admin" : role === "lecturer" ? "a lecturer" : "a student"}? ` +
        "They will be signed out and need to sign in again."
    );
    if (!ok) return;

    try {
      setChangingId(user.id);
      const res = await changeUserRole(user.id, role);
      toast.success(res?.message || "Role changed.");
      setUsers((await getUsers()) || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not change the role.");
    } finally {
      setChangingId(null);
    }
  };




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

                <th>
                  Change role
                </th>

              </tr>

            </thead>




            <tbody>


              {

                loading ? (

                  <tr>
                    <td colSpan={5}>Loading users...</td>
                  </tr>

                ) : filteredUsers.length === 0 ? (

                  <tr>
                    <td colSpan={5}>No users found.</td>
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

                    <td>

                      <div className="role-actions">
                        {(user.assignableRoles || []).length === 0 ? (
                          <small>—</small>
                        ) : (
                          user.assignableRoles.map((role) => (
                            <button
                              key={role}
                              type="button"
                              className="role-btn"
                              disabled={changingId === user.id}
                              onClick={() => handleChangeRole(user, role)}
                            >
                              {ROLE_BUTTON[role] || role}
                            </button>
                          ))
                        )}
                      </div>

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

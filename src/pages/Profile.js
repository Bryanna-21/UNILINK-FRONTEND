import { useEffect, useState } from "react";
import API from "../services/api";
export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="card">
        <h2>My Profile</h2>

        {user ? (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </>
  );
}

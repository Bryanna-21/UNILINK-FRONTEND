import { useAuth } from "../context/AuthContext";

export default function Profile() {
  // AuthContext already holds the logged-in user (populated at login
  // and rehydrated from localStorage on load) — no separate fetch
  // needed. The previous version called GET /users/me, a route that
  // was never actually built on the backend.
  const { user } = useAuth();

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

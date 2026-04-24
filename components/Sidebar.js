export default function Sidebar() {
  return (
    <div className="sidebar">
      <p onClick={() => window.location.href="/feed"}>🏠 Feed</p>
      <p onClick={() => window.location.href="/profile"}>👤 Profile</p>
      <p onClick={() => {
        localStorage.removeItem("token");
        window.location.href="/";
      }}>🚪 Logout</p>
    </div>
  );
}

import MainLayout from "../layout/MainLayout";

export default function AdminDashboard() {
  return (
    <MainLayout>
      <h2>Admin Dashboard</h2>

      <div className="card">
        <h3>Total Users</h3>
      </div>

      <div className="card">
        <h3>Total Communities</h3>
      </div>

      <div className="card">
        <h3>Reported Posts</h3>
      </div>
    </MainLayout>
  );
}

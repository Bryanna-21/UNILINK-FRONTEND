import MainLayout from "../layout/MainLayout";

export default function StudentDashboard() {
  return (
    <MainLayout>
      <h2>Student Dashboard</h2>

      <div className="card">
        <h3>My Communities</h3>
      </div>

      <div className="card">
        <h3>Upcoming Events</h3>
      </div>

      <div className="card">
        <h3>Recent Activity</h3>
      </div>
    </MainLayout>
  );
}

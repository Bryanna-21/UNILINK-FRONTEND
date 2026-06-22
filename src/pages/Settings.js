import MainLayout from "../layout/MainLayout";

export default function Settings() {
  return (
    <MainLayout>
      <h2>Settings</h2>

      <div className="card">
        <h3>Account Settings</h3>
        <p>Profile settings will appear here.</p>
      </div>

      <div className="card">
        <h3>Privacy</h3>
        <p>Privacy settings will appear here.</p>
      </div>
    </MainLayout>
  );
}

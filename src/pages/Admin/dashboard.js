export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-slate-800">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Total Users</h3>
          <p className="text-slate-500 text-sm">Monitor user registration and account configurations.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Total Communities</h3>
          <p className="text-slate-500 text-sm">Manage group channels, moderation, and approvals.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Reported Posts</h3>
          <p className="text-slate-500 text-sm">Handle flags, reviews, and community moderation requests.</p>
        </div>
      </div>
    </div>
  );
}

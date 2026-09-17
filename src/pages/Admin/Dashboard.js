import { useEffect, useState } from "react";
import { getDashboardStats } from "../../services/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setStats(null)); // leave cards showing "—" rather than surfacing a toast for a page that's mostly informational
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-slate-800">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Total Users</h3>
          <p className="text-2xl font-bold text-slate-800 mb-1">
            {stats?.totalUsers ?? "—"}
          </p>
          <p className="text-slate-500 text-sm">Monitor user registration and account configurations.</p>
        </div>

        {/*
          Total Communities and Reported Posts stay as "Not yet
          available" rather than a fake number: there's no single
          "community" model to count (clubs, study groups, polls, and
          announcements are each their own collection with no
          unifying concept between them), and no post-reporting/
          flagging system exists anywhere in this backend at all.
          Showing 0 here would misrepresent an unbuilt feature as a
          working one reporting no activity.
        */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Total Communities</h3>
          <p className="text-sm text-slate-400 italic mb-1">Not yet available</p>
          <p className="text-slate-500 text-sm">Manage group channels, moderation, and approvals.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Reported Posts</h3>
          <p className="text-sm text-slate-400 italic mb-1">Not yet available</p>
          <p className="text-slate-500 text-sm">Handle flags, reviews, and community moderation requests.</p>
        </div>
      </div>
    </div>
  );
}

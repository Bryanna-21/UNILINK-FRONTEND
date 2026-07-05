export default function LecturerDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-slate-800">Lecturer Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Course Communities</h3>
          <p className="text-slate-500 text-sm">Manage student interaction and discussions for your modules.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Announcements</h3>
          <p className="text-slate-500 text-sm">Post important updates and notify students instantly.</p>
        </div>
      </div>
    </div>
  );
}

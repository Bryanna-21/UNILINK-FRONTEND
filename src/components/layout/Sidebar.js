import { NavLink } from "react-router-dom";
import { FaSignOutAlt, FaTimes } from "react-icons/fa";
import { navigation } from "../../constants/navigation";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const menu = navigation[user?.role] || [];

  return (
    <>
      {/* Backdrop - mobile only, shown when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-72 bg-slate-900 text-white
          flex flex-col shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="h-20 flex items-center justify-between px-5 border-b border-slate-700">
          <h1 className="text-2xl font-bold tracking-wide">UniLink</h1>
          <button
            onClick={onClose}
            className="lg:hidden text-white hover:text-slate-300"
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 shadow-lg"
                      : "hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="border-t border-slate-700 p-4">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

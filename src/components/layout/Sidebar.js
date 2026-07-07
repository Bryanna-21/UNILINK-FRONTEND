import { NavLink } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

import { navigation } from "../../constants/navigation";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  const menu = navigation[user?.role] || [];

  return (
    <aside className="w-72 h-screen bg-slate-900 text-white flex flex-col shadow-xl">

      <div className="h-20 flex items-center justify-center border-b border-slate-700">

        <h1 className="text-2xl font-bold tracking-wide">
          UniLink
        </h1>

      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">

        {menu.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
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
  );
}

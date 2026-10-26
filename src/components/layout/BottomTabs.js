import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { studentTabs, tabForPath } from "../../constants/navigation";

import "../../styles/layout/bottomTabs.css";

// The app's bottom tab bar (Home, Academics, Campus, Messages, Me),
// shown to students below the desktop breakpoint, where the sidebar is
// hidden. Same labels, order and icons as the app.
export default function BottomTabs() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const show = user?.role === "student";

  useEffect(() => {
    if (!show) return undefined;

    document.body.classList.add("has-bottom-tabs");
    return () => document.body.classList.remove("has-bottom-tabs");
  }, [show]);

  if (!show) return null;

  const active = tabForPath(pathname);

  return (
    <nav className="bottom-tabs" aria-label="Main">
      {studentTabs.map((tab) => (
        <Link
          key={tab.key}
          to={tab.path}
          className={`bottom-tab${active === tab.key ? " bottom-tab--active" : ""}`}
          aria-current={active === tab.key ? "page" : undefined}
        >
          <span className="bottom-tab-glyph" aria-hidden="true">
            {tab.glyph}
          </span>
          <span className="bottom-tab-label">{tab.title}</span>
        </Link>
      ))}
    </nav>
  );
}

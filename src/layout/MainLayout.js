import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MainLayout.css";

export default function MainLayout({ children }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setShowMenu(false);
  };

  return (
    <div className="main-layout">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo" onClick={() => handleNavigate("/feed")}>
            <h1>🎓 UniLink</h1>
          </div>
          
          <button 
            className="menu-toggle"
            onClick={() => setShowMenu(!showMenu)}
          >
            ☰
          </button>
          
          {/* Desktop Navigation */}
          <nav className="nav-menu">
            <button onClick={() => handleNavigate("/feed")} className="nav-button">
              📰 Feed
            </button>
            <button onClick={handleLogout} className="nav-button logout-btn">
              🚪 Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="mobile-menu">
          <button onClick={() => handleNavigate("/feed")} className="mobile-nav-button">
            📰 Feed
          </button>
          <button onClick={handleLogout} className="mobile-nav-button logout-btn">
            🚪 Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 UniLink. All rights reserved.</p>
      </footer>
    </div>
  );
}

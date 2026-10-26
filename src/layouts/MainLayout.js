import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import PageTransition from "../components/layout/PageTransition";
import AppFooter from "../components/layout/AppFooter";
import EmergencyMenu from "../components/Emergency";
import PrivacyNoticeGate from "../components/PrivacyNoticeGate";
import "../styles/layout/layout.css";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="content">
          <PageTransition><Outlet /></PageTransition>
          <AppFooter />
        </div>
      </div>
      <EmergencyMenu />
      <PrivacyNoticeGate />
    </div>
  );
}

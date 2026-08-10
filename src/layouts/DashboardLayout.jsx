import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

function DashboardLayout({
  children,
  user,
  onLogout,
  activeSection,
  setActiveSection,
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`dashboard-layout ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        onLogout={onLogout}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="dashboard-main">
        <Topbar user={user} />

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
import React from "react";
import {
  FaHome,
  FaFileAlt,
  FaRobot,
  FaChartBar,
  FaBuilding,
  FaStar,
  FaInfoCircle,
  FaEnvelope,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import "../../assets/styles/Sidebar.css";

function Sidebar({
  onLogout,
  activeSection,
  setActiveSection,
  collapsed,
  setCollapsed,
}) {
  const menu = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      section: "dashboard",
    },
    {
      name: "Resume",
      icon: <FaFileAlt />,
      section: "resume",
    },
    {
      name: "Interview",
      icon: <FaRobot />,
      section: "interview",
    },
    {
      name: "Companies",
      icon: <FaBuilding />,
      section: "companies",
    },
    {
      name: "Features",
      icon: <FaStar />,
      section: "features",
    },
    {
      name: "Results",
      icon: <FaChartBar />,
      section: "results",
    },
    {
      name: "About",
      icon: <FaInfoCircle />,
      section: "about",
    },
    {
      name: "Contact",
      icon: <FaEnvelope />,
      section: "contact",
    },
    {
      name: "Profile",
      icon: <FaUser />,
      section: "profile",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      section: "settings",
    },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        <FaBars />
      </button>

      <div className="sidebar-logo">
        <h2>DEBIC</h2>
        <span>AI Interview Platform</span>
      </div>

      <nav className="sidebar-nav">
        {menu.map((item) => (
          <button
            key={item.name}
            type="button"
            className={activeSection === item.section ? "active" : ""}
            onClick={() => setActiveSection(item.section)}
            title={collapsed ? item.name : ""}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          type="button"
          className="logout-btn"
          onClick={onLogout}
          title={collapsed ? "Logout" : ""}
        >
          <span className="sidebar-icon">
            <FaSignOutAlt />
          </span>
          <span className="sidebar-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
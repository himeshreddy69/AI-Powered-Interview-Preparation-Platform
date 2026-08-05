import { Link, useLocation } from "react-router-dom";

import {
  FaHome,
  FaFileAlt,
  FaRobot,
  FaChartBar,
  FaUser,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

import "../../assets/styles/Sidebar.css";

function Sidebar({ onLogout }) {

  const location = useLocation();

  const menu = [

    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard"
    },

    {
      name: "Resume",
      icon: <FaFileAlt />,
      path: "/upload-resume"
    },

    {
      name: "Interview",
      icon: <FaRobot />,
      path: "/interview"
    },

    {
      name: "Results",
      icon: <FaChartBar />,
      path: "/results"
    },

    {
      name: "Profile",
      icon: <FaUser />,
      path: "/profile"
    },

    {
      name: "Settings",
      icon: <FaCog />,
      path: "/settings"
    }

  ];



  return (

    <aside className="sidebar">

      <h2 className="logo">

        DEBIC

      </h2>



      <nav>

        {

          menu.map((item) => (

            <Link

              key={item.name}

              to={item.path}

              className={
                location.pathname === item.path
                  ? "active"
                  : ""
              }

            >

              {item.icon}

              <span>

                {item.name}

              </span>

            </Link>

          ))

        }

      </nav>



      <button

        className="logout-btn"

        onClick={onLogout}

      >

        <FaSignOutAlt />

        Logout

      </button>

    </aside>

  );

}

export default Sidebar;
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

function DashboardLayout({ children, user, onLogout }) {

  return (

    <div className="dashboard-layout">

      <Sidebar
        onLogout={onLogout}
      />

      <div className="dashboard-main">

        <Topbar
          user={user}
        />

        <main className="dashboard-content">

          {children}

        </main>

      </div>

    </div>

  );

}

export default DashboardLayout;
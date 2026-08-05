import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import DashboardLayout from "../layouts/DashboardLayout";

import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsCards from "../components/dashboard/StatsCards";
import ProfileCard from "../components/dashboard/ProfileCard";
import ResumeCard from "../components/dashboard/ResumeCard";
import InterviewCategories from "../components/dashboard/InterviewCategories";
import RecentInterviews from "../components/dashboard/RecentInterviews";
import PerformanceChart from "../components/dashboard/PerformanceChart";

import "../assets/styles/Dashboard.css";

function Dashboard() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  async function handleLogout() {

    try {

      await logout();

      navigate("/login", {
        replace: true
      });

    } catch (error) {

      console.error("Logout failed:", error);

    }

  }

  return (

    <DashboardLayout
      user={user}
      onLogout={handleLogout}
    >

      <div className="dashboard-page">

        <WelcomeCard
          user={user}
        />

        <div className="dashboard-grid">

          <StatsCards />

          <ProfileCard
            user={user}
          />

          <ResumeCard />

          <InterviewCategories />

          <RecentInterviews />

          <PerformanceChart />

        </div>

      </div>

    </DashboardLayout>

  );

}

export default Dashboard;
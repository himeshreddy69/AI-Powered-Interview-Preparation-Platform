import { useState } from "react";
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
import InterviewPanel from "../components/dashboard/InterviewPanel";
import CompaniesPanel from "../components/dashboard/CompaniesPanel";
import FeaturesPanel from "../components/dashboard/FeaturesPanel";
import AboutPanel from "../components/dashboard/AboutPanel";
import ContactPanel from "../components/dashboard/ContactPanel";
import Results from "./Results";
import Profile from "./Profile";
import Settings from "./Settings";

import "../assets/styles/Dashboard.css";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [lastSessionResult, setLastSessionResult] = useState(null);

  // Carries a chosen category or company through to the interview setup form,
  // so picking "HR Interview" or "Google" actually pre-fills the session.
  const [interviewPreset, setInterviewPreset] = useState(null);

  async function handleLogout() {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const handleCompleteInterview = (resultData) => {
    setLastSessionResult(resultData);
    setActiveSection("results");
  };

  // A row click passes that session. "View All" passes null, which must clear
  // the pinned session — otherwise Results keeps showing the last one opened.
  const handleViewSessionDetails = (sessionData) => {
    if (sessionData && sessionData.overallScore !== undefined) {
      setLastSessionResult(sessionData);
    } else {
      setLastSessionResult(null);
    }
    setActiveSection("results");
  };

  const handleSelectCategory = (categoryName) => {
    setInterviewPreset({ category: categoryName });
    setActiveSection("interview");
  };

  const handleStartCompanyTrack = (trackData) => {
    setInterviewPreset(trackData || null);
    setActiveSection("interview");
  };

  return (
    <DashboardLayout
      user={user}
      onLogout={handleLogout}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      {/* DASHBOARD */}
      {activeSection === "dashboard" && (
        <div className="dashboard-page">
          <WelcomeCard user={user} />

          <div className="dashboard-grid">
            <StatsCards />

            <ProfileCard user={user} onEdit={() => setActiveSection("profile")} />

            <ResumeCard />

            <InterviewCategories onSelectCategory={handleSelectCategory} />

            <RecentInterviews onViewDetails={handleViewSessionDetails} />

            <PerformanceChart />
          </div>
        </div>
      )}

      {/* RESUME */}
      {activeSection === "resume" && (
        <div className="dashboard-section">
          <ResumeCard />
        </div>
      )}

      {/* INTERVIEW */}
      {activeSection === "interview" && (
        <div className="dashboard-section">
          <InterviewPanel
            preset={interviewPreset}
            onCompleteSession={handleCompleteInterview}
          />
        </div>
      )}

      {/* COMPANIES */}
      {activeSection === "companies" && (
        <div className="dashboard-section">
          <CompaniesPanel onStartCompanyInterview={handleStartCompanyTrack} />
        </div>
      )}

      {/* FEATURES */}
      {activeSection === "features" && (
        <div className="dashboard-section">
          <FeaturesPanel onNavigate={(sec) => setActiveSection(sec)} />
        </div>
      )}

      {/* RESULTS */}
      {activeSection === "results" && (
        <div className="dashboard-section">
          <Results
            resultData={lastSessionResult}
            onRetake={() => setActiveSection("interview")}
          />
        </div>
      )}

      {/* ABOUT */}
      {activeSection === "about" && (
        <div className="dashboard-section">
          <AboutPanel />
        </div>
      )}

      {/* CONTACT */}
      {activeSection === "contact" && (
        <div className="dashboard-section">
          <ContactPanel />
        </div>
      )}

      {/* PROFILE */}
      {activeSection === "profile" && (
        <div className="dashboard-section">
          <Profile />
        </div>
      )}

      {/* SETTINGS */}
      {activeSection === "settings" && (
        <div className="dashboard-section">
          <Settings />
        </div>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;
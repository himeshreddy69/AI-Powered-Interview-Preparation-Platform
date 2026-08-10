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

import "../assets/styles/Dashboard.css";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [lastSessionResult, setLastSessionResult] = useState(null);

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

  const handleViewSessionDetails = (sessionData) => {
    if (sessionData && sessionData.overallScore !== undefined) {
      setLastSessionResult(sessionData);
    }
    setActiveSection("results");
  };

  const handleStartCompanyTrack = (trackData) => {
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

            <ProfileCard user={user} />

            <ResumeCard />

            <InterviewCategories onSelectCategory={(cat) => setActiveSection("interview")} />

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
          <InterviewPanel onCompleteSession={handleCompleteInterview} />
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
          <ProfileCard user={user} />
        </div>
      )}

      {/* SETTINGS */}
      {activeSection === "settings" && (
        <div className="dashboard-section" style={{ background: "#fff", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <h1 style={{ margin: "0 0 8px", fontSize: "24px", color: "#0f172a" }}>Account & AI Settings</h1>
          <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
            Configure your environment keys and practice preferences.
          </p>

          <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <h4 style={{ margin: "0 0 6px", fontSize: "15px", color: "#334155" }}>Google Gemini API Configuration</h4>
            <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#64748b" }}>
              To enable live Gemini AI questions and answer scoring, add your API key to your <code>.env</code> file:
            </p>
            <pre style={{ background: "#0f172a", color: "#38bdf8", padding: "12px", borderRadius: "8px", fontSize: "12px", overflowX: "auto" }}>
              VITE_GEMINI_API_KEY=your_gemini_api_key_here
            </pre>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Dashboard;
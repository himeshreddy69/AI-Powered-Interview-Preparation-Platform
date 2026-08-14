import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getUserProfile, saveUserProfile } from "../services/supabase/profiles";
import { isGeminiConfigured } from "../services/ai/gemini";
import { isSupabaseConfigured } from "../services/supabase/supabase";
import "../assets/styles/Settings.css";

const TARGET_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Data Scientist",
  "DevOps Engineer",
  "Product Manager",
];

const QUESTION_COUNTS = [3, 5, 8, 10];

function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [questionCount, setQuestionCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      const profile = await getUserProfile(user.uid);
      if (cancelled) return;

      if (profile) {
        setTargetRole(profile.defaultTargetRole || "Software Engineer");
        setQuestionCount(profile.defaultQuestionCount ?? 5);
      }
      setLoading(false);
    }

    loadSettings();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!user?.uid) return;

    setStatus("Saving...");
    try {
      await saveUserProfile(user.uid, {
        defaultTargetRole: targetRole,
        defaultQuestionCount: Number(questionCount),
      });
      setStatus("Settings saved.");
    } catch (error) {
      console.error(error);
      setStatus("Could not save your settings.");
    } finally {
      setTimeout(() => setStatus(""), 4000);
    }
  };

  if (loading) {
    return <div className="settings-page"><p>Loading your settings...</p></div>;
  }

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>
        <p>Choose how your mock interviews start, and how the app looks.</p>
      </header>

      <form className="settings-card" onSubmit={handleSave}>
        <h2>Interview defaults</h2>
        <p className="settings-note">
          These are pre-filled every time you start a new mock interview.
        </p>

        <label htmlFor="settings-role">Target role</label>
        <select
          id="settings-role"
          value={targetRole}
          onChange={(event) => setTargetRole(event.target.value)}
        >
          {TARGET_ROLES.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>

        <label htmlFor="settings-count">Number of questions</label>
        <select
          id="settings-count"
          value={questionCount}
          onChange={(event) => setQuestionCount(Number(event.target.value))}
        >
          {QUESTION_COUNTS.map((count) => (
            <option key={count} value={count}>{count} questions</option>
          ))}
        </select>

        <button type="submit" className="settings-save-btn">Save Settings</button>

        {status && <p className="settings-status">{status}</p>}
      </form>

      <section className="settings-card">
        <h2>Appearance</h2>
        <p className="settings-note">Dark mode is easier on the eyes at night.</p>

        <div className="settings-row">
          <div>
            <strong>Dark mode</strong>
            <span className="settings-row-hint">
              Currently {theme === "dark" ? "on" : "off"}
            </span>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={theme === "dark"}
            aria-label="Toggle dark mode"
            className={`settings-toggle ${theme === "dark" ? "is-on" : ""}`}
            onClick={toggleTheme}
          >
            <span className="settings-toggle-knob" />
          </button>
        </div>
      </section>

      <section className="settings-card">
        <h2>Account</h2>

        <div className="settings-row">
          <div>
            <strong>Email</strong>
            <span className="settings-row-hint">{user?.email || "Not signed in"}</span>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <strong>AI question generation</strong>
            <span className="settings-row-hint">
              {isGeminiConfigured
                ? "Live — powered by Google Gemini."
                : "Offline — showing practice questions from a built-in sample set."}
            </span>
          </div>
          <span className={`settings-pill ${isGeminiConfigured ? "is-ok" : "is-warn"}`}>
            {isGeminiConfigured ? "Connected" : "Not connected"}
          </span>
        </div>

        <div className="settings-row">
          <div>
            <strong>Cloud sync</strong>
            <span className="settings-row-hint">
              {isSupabaseConfigured
                ? "Your results are saved to your account."
                : "Your results are saved on this device only."}
            </span>
          </div>
          <span className={`settings-pill ${isSupabaseConfigured ? "is-ok" : "is-warn"}`}>
            {isSupabaseConfigured ? "Connected" : "Not connected"}
          </span>
        </div>
      </section>
    </div>
  );
}

export default Settings;

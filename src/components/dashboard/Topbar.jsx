import { useTheme } from "../../context/ThemeContext";
import "../../assets/styles/Topbar.css";

function Topbar({ user }) {
  const { theme, toggleTheme } = useTheme();

  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0]?.split(/[._\d]/)[0] ||
    "User";

  return (
    <header className="topbar">
      <div className="topbar-content">
        {/* LEFT SIDE */}
        <div className="topbar-heading">
          <h1>Dashboard</h1>

          <p>
            Welcome back, <strong>{displayName}</strong>
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="topbar-profile" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title="Toggle Light / Dark Mode"
          >
            <span>{theme === "dark" ? "☀️ Light" : "🌙 Dark"}</span>
          </button>

          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="Profile"
          />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
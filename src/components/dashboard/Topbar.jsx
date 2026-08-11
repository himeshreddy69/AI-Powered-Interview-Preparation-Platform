import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { getUserProfile } from "../../services/firebase/firestore";
import "../../assets/styles/Topbar.css";

function Topbar({ user }) {
  const { theme, toggleTheme } = useTheme();

  const [profileImage, setProfileImage] = useState("");

  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0]?.split(/[._\d]/)[0] ||
    "User";

  useEffect(() => {
    const loadProfileImage = async () => {
      if (!user?.uid) return;

      try {
        const profile = await getUserProfile(user.uid);

        if (profile?.photo) {
          setProfileImage(profile.photo);
        }
      } catch (error) {
        console.error("Error loading profile image:", error);
      }
    };

    loadProfileImage();
  }, [user]);

  const defaultProfileImage =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

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
        <div
          className="topbar-profile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}
        >
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title="Toggle Light / Dark Mode"
          >
            <span>
              {theme === "dark"
                ? "☀️ Light"
                : "🌙 Dark"}
            </span>
          </button>

          <img
            src={profileImage || defaultProfileImage}
            alt="Profile"
          />
        </div>

      </div>
    </header>
  );
}

export default Topbar;
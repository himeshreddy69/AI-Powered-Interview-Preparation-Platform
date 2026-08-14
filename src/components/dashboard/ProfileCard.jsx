import { useEffect, useState } from "react";
import { getUserProfile } from "../../services/supabase/profiles";
import "../../assets/styles/ProfileCard.css";

function ProfileCard({ user, onEdit }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!user?.uid) return;
      const data = await getUserProfile(user.uid);
      if (!cancelled) setProfile(data);
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const displayName =
    profile?.name ||
    user?.displayName ||
    user?.email?.split("@")[0]?.split(/[._\d]/)[0] ||
    "User";

  const photoUrl = profile?.photoUrl || "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <section className="dashboard-card profile-card">
      <div className="profile-card-header">
        <h2>Profile</h2>
        <span>Account</span>
      </div>

      <div className="profile-content">
        {photoUrl ? (
          <img src={photoUrl} alt="Profile" className="profile-image" />
        ) : (
          <div className="profile-image profile-image-placeholder" aria-hidden="true">
            {initial}
          </div>
        )}

        <h3>{displayName}</h3>

        <p>{user?.email}</p>

        {onEdit && (
          <button type="button" className="dashboard-btn" onClick={onEdit}>
            Edit Profile
          </button>
        )}
      </div>
    </section>
  );
}

export default ProfileCard;

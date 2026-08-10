import "../../assets/styles/ProfileCard.css";

function ProfileCard({ user }) {
  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0]?.split(/[._\d]/)[0] ||
    "User";

  return (
    <section className="dashboard-card profile-card">
      <div className="profile-card-header">
        <h2>Profile</h2>
        <span>Account</span>
      </div>

      <div className="profile-content">
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="Profile"
          className="profile-image"
        />

        <h3>{displayName}</h3>

        <p>{user?.email}</p>

        <button className="dashboard-btn">
          Edit Profile
        </button>
      </div>
    </section>
  );
}

export default ProfileCard;
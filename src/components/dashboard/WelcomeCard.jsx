import "../../assets/styles/WelcomeCard.css";

function WelcomeCard({ user }) {
  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0]?.split(/[._\d]/)[0] ||
    "User";

  return (
    <div className="dashboard-card welcome-card">
      <h2>
        Welcome, {displayName} 👋
      </h2>

      <p>
        Welcome to the DEBIC AI Interview Preparation Platform.
        Practice interviews, improve your communication,
        and track your progress using AI-powered feedback.
      </p>
    </div>
  );
}

export default WelcomeCard;
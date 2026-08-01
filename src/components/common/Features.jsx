import "../../assets/styles/Features.css";
import {
  FaFileAlt,
  FaRobot,
  FaMicrophone,
  FaChartLine,
  FaBrain,
  FaAward,
} from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaFileAlt />,
      title: "Resume Analysis",
      description:
        "Upload your resume and let AI analyze your skills, experience, and strengths.",
    },
    {
      icon: <FaBrain />,
      title: "AI Interview Questions",
      description:
        "Generate personalized interview questions based on your resume and selected company.",
    },
    {
      icon: <FaMicrophone />,
      title: "Voice Mock Interview",
      description:
        "Practice real interviews using voice recording with timer support.",
    },
    {
      icon: <FaRobot />,
      title: "AI Evaluation",
      description:
        "Receive instant AI feedback on communication, confidence, and technical answers.",
    },
    {
      icon: <FaChartLine />,
      title: "Progress Dashboard",
      description:
        "Monitor your weekly and monthly interview performance with analytics.",
    },
    {
      icon: <FaAward />,
      title: "Achievements & Badges",
      description:
        "Earn badges, maintain interview streaks, and unlock achievements.",
    },
  ];

  return (
    <section className="features-section" id="features">
      <h2>Powerful Features</h2>

      <p className="features-subtitle">
        Everything you need to crack your dream interview in one platform.
      </p>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>

            <h3>{feature.title}</h3>

            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
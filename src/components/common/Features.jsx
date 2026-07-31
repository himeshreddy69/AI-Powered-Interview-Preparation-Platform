import {
  FaFileAlt,
  FaRobot,
  FaMicrophone,
  FaChartLine,
} from "react-icons/fa";

function Features() {
  return (
    <section className="features" id="features">
      <h2>Our Features</h2>

      <div className="feature-container">

        <div className="feature-card">
          <FaFileAlt />
          <h3>Resume Analysis</h3>
          <p>Upload your resume and let AI identify your skills.</p>
        </div>

        <div className="feature-card">
          <FaRobot />
          <h3>AI Questions</h3>
          <p>Generate interview questions based on your resume.</p>
        </div>

        <div className="feature-card">
          <FaMicrophone />
          <h3>Mock Interview</h3>
          <p>Practice interviews with voice recording and timer.</p>
        </div>

        <div className="feature-card">
          <FaChartLine />
          <h3>Progress Dashboard</h3>
          <p>Track your interview performance using charts.</p>
        </div>

      </div>
    </section>
  );
}

export default Features;
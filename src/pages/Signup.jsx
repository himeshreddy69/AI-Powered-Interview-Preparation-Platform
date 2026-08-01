import { Link } from "react-router-dom";
import "../../assets/styles/Signup.css";
import registerIllustration from "../assets/images/register-illustration.png";
function Signup() {
  return (
    <div className="signup-container">
        <div className="signup-left">

  <img
    src={registerIllustration}
    alt="Register Illustration"
    className="register-image"
  />

  <h2>Why Join DEBIC?</h2>

  <ul>
    <li>Get AI-generated interview questions tailored to your resume.</li>

    <li>Practice company-specific mock interviews with realistic scenarios.</li>

    <li>Receive detailed AI feedback to improve your interview performance.</li>

    <li>Track your progress and build confidence before real interviews.</li>
  </ul>

</div>


      <div className="signup-right">

        <h2>Create your DEBIC Account</h2>

        <form>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
          />

          <label>Current Status</label>

          <select>
            <option>Student</option>
            <option>Graduate</option>
            <option>Working Professional</option>
          </select>

          <button type="submit" className="signup-btn">
            Create Account
          </button>

        </form>

        <p className="login-text">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Signup;
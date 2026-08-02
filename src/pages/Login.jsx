import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAuthErrorMessage } from "../services/firebase/auth";
import "../assets/styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname || "/dashboard";

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(destination, { replace: true });
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-container">
      <div className="left-panel">
        <h1>New to DEBIC?</h1>
        <ul>
          <li>Practice AI-powered mock interviews.</li>
          <li>Get personalized interview questions based on your resume.</li>
          <li>Prepare for top companies with company-specific interview rounds.</li>
          <li>Track your interview performance with AI feedback.</li>
        </ul>
        <button type="button" className="register-btn" onClick={() => navigate("/register")}>
          Create Free Account
        </button>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Interview preparation illustration"
          className="login-image"
        />
      </div>

      <form className="right-panel" onSubmit={handleLogin}>
        <h1>Login</h1>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {error && <p className="auth-error" role="alert">{error}</p>}
        <Link to="/register">Forgot Password?</Link>
        <button className="login-btn" type="submit" disabled={submitting}>
          {submitting ? "Signing In..." : "Sign In"}
        </button>
        <p className="otp">Use OTP to Login</p>
        <div className="divider"><span>Or</span></div>
        <button className="google-btn" type="button" disabled>
          Google sign-in coming soon
        </button>
      </form>
    </div>
  );
}

export default Login;

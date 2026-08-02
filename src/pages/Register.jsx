import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getAuthErrorMessage } from "../services/firebase/auth";
import { createUserProfile } from "../services/firebase/firestore";
import "../assets/styles/Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const credential = await signup(email, password);
      await createUserProfile({
        uid: credential.user.uid,
        name: name.trim(),
        email: credential.user.email,
      });
      navigate("/dashboard", { replace: true });
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="register-container">
      <section className="register-info-panel">
        <h1>Start your interview journey</h1>
        <p>Create a free account to practice and track your progress with DEBIC.</p>
      </section>

      <form className="register-form-panel" onSubmit={handleRegister}>
        <h1>Create Account</h1>
        <label htmlFor="register-name">Name</label>
        <input id="register-name" type="text" placeholder="Enter your name" value={name} onChange={(event) => setName(event.target.value)} required />
        <label htmlFor="register-email">Email</label>
        <input id="register-email" type="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <label htmlFor="register-password">Password</label>
        <div className="password-field">
          <input id="register-password" type={showPassword ? "text" : "password"} placeholder="At least 6 characters" value={password} onChange={(event) => setPassword(event.target.value)} minLength="6" required />
          <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
          </button>
        </div>
        <label htmlFor="register-confirm-password">Confirm Password</label>
        <div className="password-field">
          <input id="register-confirm-password" type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength="6" required />
          <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
            {showConfirmPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
          </button>
        </div>
        {error && <p className="register-error" role="alert">{error}</p>}
        <button className="register-submit-btn" type="submit" disabled={submitting}>
          {submitting ? "Creating Account..." : "Register"}
        </button>
        <p className="register-signin">Already have an account? <Link to="/login">Sign In</Link></p>
      </form>
    </main>
  );
}

export default Register;

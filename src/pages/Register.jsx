import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAuthErrorMessage } from "../services/firebase/auth";
import { createUserProfile } from "../services/firebase/firestore";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleRegister(event) {
    event.preventDefault();
    setError("");

    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");

    setSubmitting(true);
    try {
      const credential = await signup(email, password);
      await createUserProfile({ uid: credential.user.uid, name, email: credential.user.email });
      navigate("/dashboard", { replace: true });
    } catch (authError) {
      setError(getAuthErrorMessage(authError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <input type="text" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength="6" />
      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength="6" />
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={submitting}>{submitting ? "Creating Account..." : "Register"}</button>
      <p>Already have an account? <Link to="/login">Sign In</Link></p>
    </form>
  );
}

export default Register;

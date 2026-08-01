import { Link, useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "../../assets/styles/Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <FaRobot className="logo-icon" />
        <h2>DEBIC</h2>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <a href="#features">Features</a>
        <a href="#companies">Companies</a>
        <Link to="/about">About</Link>
        <a href="#contact">Contact</a>
      </div>

      <div className="nav-buttons">
        {user ? (
          <>
            <Link to="/dashboard" className="login-btn">
              Dashboard
            </Link>

            <button
              type="button"
              className="register-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/register" className="register-btn">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
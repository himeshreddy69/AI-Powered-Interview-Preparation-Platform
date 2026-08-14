import { Link, useLocation } from "react-router-dom";
import "../assets/styles/NotFound.css";

function NotFound() {
  const location = useLocation();

  return (
    <main className="notfound-container">
      <div className="notfound-code" aria-hidden="true">404</div>

      <h1>This page does not exist</h1>

      <p>
        We could not find <code>{location.pathname}</code>. It may have been
        moved, or the link might be wrong.
      </p>

      <div className="notfound-actions">
        <Link to="/" className="notfound-btn notfound-btn-primary">
          Go to Home
        </Link>
        <Link to="/dashboard" className="notfound-btn">
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}

export default NotFound;

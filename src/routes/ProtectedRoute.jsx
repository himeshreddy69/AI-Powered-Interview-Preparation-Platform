import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) return <p>Loading...</p>;
  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

export default ProtectedRoute;

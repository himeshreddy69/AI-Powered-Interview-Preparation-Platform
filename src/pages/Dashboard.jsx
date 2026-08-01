import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <main>
      <h1>Welcome, {user?.email}</h1>
      <button type="button" onClick={handleLogout}>Logout</button>
    </main>
  );
}

export default Dashboard;

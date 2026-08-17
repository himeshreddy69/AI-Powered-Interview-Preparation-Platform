import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import NotFound from "../pages/NotFound";

/*
 * The dashboard and results pages drag in Recharts, pdf.js and the Gemini
 * client. A visitor on the landing page should not download any of that, so
 * these load on demand. Home / About / NotFound stay eager — they are the
 * first paint.
 */
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Results = lazy(() => import("../pages/Results"));

import ProtectedRoute from "./ProtectedRoute";

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        color: "var(--color-text-muted, #64748b)"
      }}
    >
      Loading…
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
    <Routes>

      {/* Home */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* About */}
      <Route
        path="/about"
        element={<About />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Register */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* Signup Redirect */}
      <Route
        path="/signup"
        element={
          <Navigate
            to="/register"
            replace
          />
        }
      />

      {/* Forgot Password */}
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Results */}
      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        }
      />

      {/* Unknown Route — show a 404 instead of silently sending them home,
          so a broken link is visible rather than looking like it worked. */}
      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
    </Suspense>
  );
}

export default AppRoutes;
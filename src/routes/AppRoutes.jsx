import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ForgotPassword from "../pages/ForgotPassword";

import ProtectedRoute from "./ProtectedRoute";


function AppRoutes() {

  return (

    <Routes>

      <Route 
        path="/" 
        element={<Home />} 
      />


      <Route 
        path="/about" 
        element={<About />} 
      />


      <Route 
        path="/login" 
        element={<Login />} 
      />


      <Route 
        path="/register" 
        element={<Register />} 
      />


      {/* Redirect signup to register */}
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


      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      {/* Unknown URL */}
      <Route 
        path="*" 
        element={<Home />} 
      />


    </Routes>

  );

}


export default AppRoutes;
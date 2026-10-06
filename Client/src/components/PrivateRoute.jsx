
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  // User login nahi hai
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // User logged in hai
  return <Outlet />;
};

export default PrivateRoute;


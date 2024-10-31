import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const userUID = localStorage.getItem("userUID");
    if (!userUID) {
      navigate("/"); // Redirect to login if not authenticated
    } else {
      setIsAuthenticated(true); // Set authenticated state
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null; // Prevent rendering the component until authentication is confirmed
  }

  return <Component />;
};

export default ProtectedRoute;

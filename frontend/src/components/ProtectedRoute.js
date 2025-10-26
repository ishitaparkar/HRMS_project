import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// This component acts as a gatekeeper for our protected routes.
const ProtectedRoute = () => {
  // 1. Check for the authentication token in localStorage.
  const token = localStorage.getItem('authToken');

  // 2. The logic is simple:
  //    - If a token exists, the user is considered logged in.
  //      The <Outlet /> component renders the actual page they were trying to visit (e.g., Dashboard).
  //    - If NO token exists, the user is not logged in.
  //      The <Navigate to="/" /> component automatically redirects them to the login page.
  
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
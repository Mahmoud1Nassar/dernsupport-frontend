import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token'); // Check if the user is authenticated by verifying the presence of a token

  return token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;

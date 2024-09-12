import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard'; // Sidebar
import Footer from './components/Footer';
import Box from '@mui/material/Box';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role')); // Get the user's role from localStorage

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    setIsLoggedIn(!!token); // Update logged-in status
    setRole(userRole); // Update role
  }, []);

  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    if (role !== requiredRole) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Navbar */}
        <Box sx={{ width: '100%' }}>
          <Navbar setIsLoggedIn={setIsLoggedIn} />
        </Box>

        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          {/* Sidebar */}
          {isLoggedIn && <Dashboard role={role} />}

          {/* Main section */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              mt: 8, // Adjust for the Navbar
              ml: isLoggedIn ? '240px' : '0px', // Adjust for Dashboard width
            }}
          >
            <Routes>
              
             

              {/* Redirecting to the appropriate dashboard based on the user's role */}
              {isLoggedIn && (
                <>
                  {role === 'Admin' && (
                    <Route path="/admin/*" element={<ProtectedRoute requiredRole="Admin"><Dashboard /></ProtectedRoute>} />
                  )}
                  {role === 'Technician' && (
                    <Route path="/technician/*" element={<ProtectedRoute requiredRole="Technician"><Dashboard /></ProtectedRoute>} />
                  )}
                  {role === 'Customer' && (
                    <Route path="/customer/*" element={<ProtectedRoute requiredRole="Customer"><Dashboard /></ProtectedRoute>} />
                  )}
                </>
              )}
            </Routes>
          </Box>
        </Box>

        <Footer />
      </Box>
    </Router>
  );
}

export default App;

import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Login from './Authenication/Login'; // Import Login component
import Register from './Authenication/Register'; // Import Register component

function Navbar({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token'); // Check if the user is logged in

  // Handle Logout
  const handleLogout = () => {
    // Clear token and role from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Update login state
    setIsLoggedIn(false);

    // Redirect to the login page
    navigate('/login');
  };

  // Conditional rendering for Login and Register components based on the current path
  const currentPath = window.location.pathname;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dern Support
          </Typography>

          {!isLoggedIn ? (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Conditionally render the Login or Register component */}
      {currentPath === '/login' && <Login setIsLoggedIn={setIsLoggedIn} />}
      {currentPath === '/register' && <Register setIsLoggedIn={setIsLoggedIn} />}
    </>
  );
}

export default Navbar;

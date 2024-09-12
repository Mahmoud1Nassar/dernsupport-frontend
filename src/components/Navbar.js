import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle'; // User account icon

function Navbar({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token'); // Check if the user is logged in

  // State for handling user menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setAnchorEl(null);
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#333', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Dern Support
          </Typography>

          <Button color="inherit" onClick={() => navigate('/')}>
            Home
          </Button>

          <Button color="inherit" onClick={() => navigate('/knowledge-base')}>
            Knowledge Base
          </Button>

          {!isLoggedIn ? (
            <div>
              <Button
                color="inherit"
                variant="outlined"
                sx={{ color: '#fff', borderColor: '#fff', marginRight: '10px' }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                color="primary"
                variant="contained"
                sx={{ backgroundColor: '#2196f3' }}
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </div>
          ) : (
            <>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => navigate('/dashboard')}>Dashboard</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;

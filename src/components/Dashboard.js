import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import SettingsIcon from '@mui/icons-material/Settings';
import Appointment from './Appointment';
import Quote from './Quote';
import SupportRequest from './SupportRequest';
import SparePart from './SparePart';
import { parseJwt } from './Authenication/utils'; // Assuming you have a utility to parse the token

const drawerWidth = 240;

const Dashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState('Home');
  const [role, setRole] = useState('');

  // Get the role from the token when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      setRole(userRole);
    }
  }, []);

  // Conditionally render the components based on the user's role
  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Appointments':
        return <Appointment />;
      case 'Quotes':
        return <Quote />;
      case 'Support Requests':
        return <SupportRequest />;
      case 'Spare Parts':
        return <SparePart />;
      default:
        return <Typography variant="h4">Welcome to the Dashboard</Typography>;
    }
  };

  // Conditionally render the menu items based on the user's role
  const renderMenuItems = () => {
    if (role === 'Admin') {
      // Admin sees all items
      return ['Appointments', 'Quotes', 'Support Requests', 'Spare Parts'];
    } else if (role === 'Technician') {
      // Technician sees Support Requests, Spare Parts, and Quotes
      return ['Support Requests', 'Spare Parts', 'Quotes'];
    } else if (role === 'Customer') {
      // Customer sees Appointments, Support Requests, and Quotes
      return ['Appointments', 'Support Requests', 'Quotes'];
    } else {
      // Default case, show nothing or a fallback
      return [];
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            Dashboard
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {renderMenuItems().map((text) => (
            <ListItem button key={text} onClick={() => setSelectedComponent(text)}>
              <ListItemIcon>
                {text === 'Home' ? <HomeIcon /> : text === 'Appointments' ? <ListIcon /> : <SettingsIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default', 
          p: 0,
          ml: `150px`, // Left margin to avoid overlap with Drawer
          width: 900, // Ensures content fits the remaining width
        }}
      >
        <Toolbar />
        {renderComponent()}
      </Box>
    </Box>
  );
};

export default Dashboard;

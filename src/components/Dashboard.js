import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import SupportIcon from '@mui/icons-material/Support';
import BuildIcon from '@mui/icons-material/Build';
import ReceiptIcon from '@mui/icons-material/Receipt'; // Bill icon for Quotes
import Appointment from './Appointment';
import Quote from './Quote';
import SupportRequest from './SupportRequest';
import SparePart from './SparePart';
import { parseJwt } from './Authenication/utils';

const drawerWidth = 240; // Sidebar width

const Dashboard = () => {
  const [selectedComponent, setSelectedComponent] = useState('Home');
  const [role, setRole] = useState('');

  // Fetch user role from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      setRole(userRole);
    }
  }, []);

  // Render based on selected component
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
        return <Appointment />;
    }
  };

  // Menu items based on user role
  const renderMenuItems = () => {
    if (role === 'Admin') {
      return ['Appointments', 'Quotes', 'Support Requests', 'Spare Parts'];
    } else if (role === 'Technician') {
      return ['Support Requests', 'Spare Parts', 'Quotes'];
    } else if (role === 'Customer') {
      return ['Appointments', 'Support Requests', 'Quotes'];
    } else {
      return [];
    }
  };

  // Icons for each menu item
  const getIcon = (text) => {
    switch (text) {
      case 'Appointments':
        return <ListIcon />;
      case 'Quotes':
        return <ReceiptIcon />;
      case 'Support Requests':
        return <SupportIcon />;
      case 'Spare Parts':
        return <BuildIcon />;
      default:
        return <HomeIcon />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <CssBaseline />

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#343a40', // Sidebar background color
            color: '#ffffff', // Sidebar text color
            marginTop: '64px', // Ensuring it stays under your existing navbar
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {renderMenuItems().map((text) => (
            <ListItem
              button
              key={text}
              onClick={() => setSelectedComponent(text)}
              sx={{
                '&:hover': {
                  backgroundColor: '#495057',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>{getIcon(text)}</ListItemIcon>
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
          p: 3,
          mt: 8, // Add margin-top to ensure content is below navbar
          ml: 0,
          width: '100%',
        }}
      >
        <Box
          sx={{
            p: 3,
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Light shadow
          }}
        >
          {renderComponent()}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

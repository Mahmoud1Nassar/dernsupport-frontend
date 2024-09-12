import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Paper
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          textAlign: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          p: 5,
          borderRadius: 5,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#333',
            textShadow: '2px 2px rgba(0,0,0,0.1)',
          }}
        >
          Welcome to Dern Support
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            mb: 4,
            color: '#555',
          }}
        >
          Your one-stop solution for IT support, hardware services, and knowledge sharing.
        </Typography>

        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
            sx={{
              mr: 2,
              px: 4,
              py: 1,
              fontSize: '1.1rem',
              backgroundColor: '#2196f3',
              '&:hover': {
                backgroundColor: '#1976d2',
              },
            }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/register')}
            sx={{
              mr: 2,
              px: 4,
              py: 1,
              fontSize: '1.1rem',
              borderColor: '#2196f3',
              '&:hover': {
                borderColor: '#1976d2',
                color: '#1976d2',
              },
            }}
          >
            Register
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/knowledge-base')}
            sx={{
              px: 4,
              py: 1,
              fontSize: '1.1rem',
              borderColor: '#f50057',
              '&:hover': {
                borderColor: '#c51162',
                color: '#c51162',
              },
            }}
          >
            Visit Knowledge Base
          </Button>
        </Box>
      </Container>
    </Paper>
  );
};

export default Home;

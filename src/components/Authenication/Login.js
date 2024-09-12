import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setIsLoggedIn }) {  // Accept setIsLoggedIn as a prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      });

      const token = response.data.token;

      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Decode the JWT to extract the role using the specific schema
      const parseJwt = (token) => {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          return JSON.parse(jsonPayload);
        } catch (e) {
          return null;
        }
      };

      // Extract the role from the JWT using the Microsoft schema
      const decodedToken = parseJwt(token);
      const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      // Store the role in localStorage
      localStorage.setItem('role', role);

      // Update the login state
      setIsLoggedIn(true);

      // Redirect to the appropriate dashboard based on the role
    
        navigate('/dashboard');
     
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Box sx={{ width: 300, margin: '100px auto', textAlign: 'center' }}>
      <Typography variant="h4">Login</Typography>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Box>
  );
}

export default Login;

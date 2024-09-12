import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

function Login({ setIsLoggedIn }) {
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
      localStorage.setItem('token', token);

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

      const decodedToken = parseJwt(token);
      const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      localStorage.setItem('role', role);
      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Box sx={{
      height: '100vh',
      background: 'linear-gradient(to right, #6a11cb, #2575fc)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Paper elevation={6} sx={{
        padding: 4,
        width: '100%',
        maxWidth: 400,
        textAlign: 'center',
        borderRadius: '16px'
      }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;

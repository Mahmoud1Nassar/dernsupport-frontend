import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, InputAdornment, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';

function Register({ setIsLoggedIn }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('Individual'); // Add state for user type
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        fullName,
        email,
        password,
        confirmPassword,
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
      const userRole = decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
      localStorage.setItem('role', userRole);

      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Box sx={{
      height: '100vh',
      background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
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
        <Typography variant="h4" gutterBottom>Register</Typography>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
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
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

          {/* Mock User Type Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="user-type-label">User Type</InputLabel>
            <Select
              labelId="user-type-label"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              startAdornment={(
                <InputAdornment position="start">
                  <BusinessIcon />
                </InputAdornment>
              )}
            >
              <MenuItem value="Individual">Individual</MenuItem>
              <MenuItem value="Company">Company</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Register;

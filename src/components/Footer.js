import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        backgroundColor: '#1a1a1a',
        color: '#fff',
        textAlign: 'center',
        position: 'relative',
        bottom: 0,
        width: '100%',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Dern Support
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Providing the best IT technical support since 2024
      </Typography>

      {/* Social Media Links */}
      <Box sx={{ mb: 3 }}>
        <IconButton href="https://facebook.com" target="_blank" color="inherit">
          <Facebook />
        </IconButton>
        <IconButton href="https://twitter.com" target="_blank" color="inherit">
          <Twitter />
        </IconButton>
        <IconButton href="https://linkedin.com" target="_blank" color="inherit">
          <LinkedIn />
        </IconButton>
        <IconButton href="https://instagram.com" target="_blank" color="inherit">
          <Instagram />
        </IconButton>
      </Box>

      <Typography variant="body2" sx={{ mb: 1 }}>
        <Link href="/terms" color="inherit" underline="hover">
          Terms & Conditions
        </Link>{' '}
        |{' '}
        <Link href="/privacy" color="inherit" underline="hover">
          Privacy Policy
        </Link>
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        &copy; {new Date().getFullYear()} Dern Support - All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;

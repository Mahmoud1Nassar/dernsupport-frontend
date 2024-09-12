import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Base URL from the .env file
  headers: {
    'Content-Type': 'application/json', // Default content type for all requests
  },
});

// Add a request interceptor to include the token in the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Set the token in the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally (optional)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors like token expiration or invalid requests here (optional)
    if (error.response.status === 401) {
      // You can log the user out or redirect to login page here if needed
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login'; // Redirect to login page if unauthorized
    }
    return Promise.reject(error);
  }
);

export default api;
